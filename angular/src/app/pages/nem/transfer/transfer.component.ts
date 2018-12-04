import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Address,
  PlainMessage,
  Message,
  TransferTransaction,
  Asset,
  TimeWindow,
  AssetTransferable,
  XEM,
  Password,
  AssetLevyType,
  SimpleWallet,
  AccountHttp,
  TransactionHttp,
  Account,
  PublicAccount,
  SignedTransaction
} from 'nem-library';
import { Observable, of, Subscription, from, Subject, forkJoin } from 'rxjs';
import { mergeMap, first, map, filter } from 'rxjs/operators';
import { WalletService } from '../../../services/wallet/wallet.service';
import { BalanceService } from '../../../services/nem/balance/balance.service';
import { LanguageService } from '../../../services/language/language.service';
import { Invoice } from '../../../classes/invoice';
import { RouterService } from '../../../services/router/router.service';
import { ShareService } from '../../../services/api/share/share.service';
import { AlertDialogComponent } from '../../../components/alert-dialog/alert-dialog.component';
import { UserService } from '../../../services/user/user.service';
import { nodes } from '../../../classes/nodes';
import { LoadingDialogComponent } from '../../../components/loading-dialog/loading-dialog.component';
import { AssetDefinitionService } from '../../../services/nem/asset-definition/asset-definition.service';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit, OnDestroy {
  public get lang() { return this.language.state.twoLetter; }

  public loading$ = this.balance.state$.pipe(map(state => state.loading))

  public forms = {
    recipient: "",
    message: "",
    encrypt: false,
    transferAssets: [] as {
      id: string,
      amount?: number,
      balance: Observable<Asset>
    }[],
    hidden: 0
  };

  private account$ = this.wallet.state$.pipe(
    map(state => state.entities[state.currentWalletId!]),
    map(
      (wallet) => {
        if (!wallet.wallet) {
          this.openSnackBar("import")
          return null
        }
        const password = new Password(this.user.state.currentUser!.uid);
        return SimpleWallet.readFromWLT(wallet.wallet).open(password);
      }
    )
  )

  private recipientPublicAccount$ = new Subject<PublicAccount>()
  private messageForm$ = new Subject<[string, boolean]>()

  private message$: Observable<Message> = this.messageForm$.pipe(
    mergeMap(
      (form) => {
        if (!form[1]) {
          return of(PlainMessage.create(this.forms.message))
        }

        return forkJoin(
          this.account$,
          this.recipientPublicAccount$
        ).pipe(
          map(
            (data) => {
              return data[0]!.encryptMessage(form[0], data[1])
            }
          )
        )
      }
    )
  )

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _router: RouterService,
    private language: LanguageService,
    private user: UserService,
    private wallet: WalletService,
    private balance: BalanceService,
    private assetDefinition: AssetDefinitionService,
    private share: ShareService
  ) {
  }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.recipientPublicAccount$.complete()
  }

  public load() {
    this.balance.loadBalance(
      new Address(this.wallet.state.entities[this.wallet.state.currentWalletId!].nem)
    )

    let invoice = this.route.snapshot.queryParamMap.get('invoice') || "";
    let invoiceData = Invoice.parse(decodeURI(invoice));

    if (invoiceData) {
      this.forms.recipient = invoiceData.data.addr;
      this.forms.message = invoiceData.data.msg;

      if (invoiceData.data.assets) {
        for (let asset of invoiceData.data.assets) {
          this.addTransferAsset(asset.id, asset.amount);
        }
      }
    }
  }

  public back() {
    this._router.back([""])
  }

  public onRecipientKeyup() {
    this.forms.encrypt = false
    const accountHttp = new AccountHttp(nodes)
    const address = new Address(this.forms.recipient)
    accountHttp.getFromAddress(address).pipe(
      map(
        (meta) => {
          if (!meta.publicAccount) {
            const publicAccount = {
              address: address
            }
            return publicAccount as PublicAccount
          }

          return meta.publicAccount
        }
      )
    ).subscribe(
      (publicAccount) => {
        this.recipientPublicAccount$.next(publicAccount)
      }
    )
  }

  public onMessageChange() {
    this.messageForm$.next([this.forms.message, this.forms.encrypt])
  }

  public addTransferAsset(id: string, amount?: number) {
    this.forms.transferAssets.push(
      {
        id: id,
        amount: amount,
        balance: this.balance.state$.pipe(
          mergeMap(state => from(state.assets)),
          filter(asset => asset.assetId.toString() === id)
        )
      }
    );
  }

  public deleteTransferAsset(index: number) {
    this.forms.transferAssets.splice(index, 1);
  }

  public shareInvoice() {
    let invoice = new Invoice();
    invoice.data.addr = this.forms.recipient;
    invoice.data.msg = this.forms.message;
    invoice.data.assets = this.forms.transferAssets.map(
      (asset) => {
        return { id: asset.id, amount: asset.amount || 0 }
      }
    );

    this.share.share(
      location.href + "?invoice=" + encodeURI(invoice.stringify()),
      "LCNEM Wallet"
    );
  }

  public transfer() {
    const mosaics = this.forms.transferAssets.map(
      (asset) => {
        if (asset.id == "nem:xem") {
          return new XEM(asset.amount || 0);
        }
        const definition = this.assetDefinition.state.definitions.find(definition => definition.id.toString() === asset.id)!

        return AssetTransferable.createWithAssetDefinition(definition, asset.amount || 0)
      }
    )

    forkJoin(
      this.account$,
      this.recipientPublicAccount$,
      this.message$
    ).pipe(
      map(
        (data) => {
          return TransferTransaction.createWithMosaics(
            TimeWindow.createWithDeadline(),
            data[1].address,
            mosaics,
            data[2]
          );
        }
      )
    ).subscribe(
      (transaction) => {
        this.dialog.open(
          TransferDialogComponent,
          {
            data: {
              transaction: transaction,
              message: this.forms.message
            }
          }
        ).afterClosed().pipe(
          filter(result => result)
        ).subscribe(
          () => {
            this.account$.pipe(first()).subscribe(
              (account) => {
                account!.signTransaction(transaction)
              }
            )
          }
        )
      }
    )
  }

  public announceTransaction(signed: SignedTransaction) {
    const loadingDialog = this.dialog.open(LoadingDialogComponent, { disableClose: true });

    const transactionHttp = new TransactionHttp(nodes)
    transactionHttp.announceTransaction(signed).subscribe(
      () => {
        this.dialog.open(
          AlertDialogComponent,
          {
            data: {
              title: this.translation.completed[this.lang],
              content: this.translation.completedBody[this.lang]
            }
          }
        ).afterClosed().subscribe(
          () => {
            this.router.navigate([""])
          }
        );
      },
      (error) => {
        this.dialog.open(
          AlertDialogComponent,
          {
            data: {
              title: this.translation.error[this.lang],
              content: ""
            }
          }
        );
      },
      () => {
        loadingDialog.close()
      }
    )
  }

  public openSnackBar(type: string) {
    if (type == "import") {
      this.snackBar.open(this.translation.importRequired[this.lang], undefined, { duration: 3000 });
    }
  }

  public translation = {
    recipient: {
      en: "Recipient",
      ja: "宛先"
    } as any,
    address: {
      en: "NEM address",
      ja: "NEMアドレス"
    } as any,
    importRequired: {
      en: "Importing the private key is required.",
      ja: "秘密鍵のインポートが必要です。"
    } as any,
    addressRequired: {
      en: "Correct address is required.",
      ja: "アドレスを正しく入力してください。"
    } as any,
    namespace: {
      en: "NEM namespace",
      ja: "NEMネームスペース"
    } as any,
    message: {
      en: "Message",
      ja: "メッセージ"
    } as any,
    encryption: {
      en: "Encryption",
      ja: "暗号化"
    } as any,
    assets: {
      en: "Assets for transfer",
      ja: "送信するアセット"
    } as any,
    assetName: {
      en: "Asset name",
      ja: "アセット名"
    } as any,
    amount: {
      en: "Amount",
      ja: "量"
    } as any,
    balance: {
      en: "Balance",
      ja: "残高"
    } as any,
    share: {
      en: "Create an invoice without transfer",
      ja: "送信せずに請求書を作る"
    } as any,
    transfer: {
      en: "Transfer",
      ja: "送信"
    } as any,
    error: {
      en: "Error",
      ja: "エラー"
    } as any,
    completed: {
      en: "Completed",
      ja: "送信しました"
    } as any,
    completedBody: {
      en: "Please confirm later that the transaction be confirmed.",
      ja: "ブロックチェーンに正しく送信されましたが、正しく承認を受ける必要もあります。後ほど、承認されたことを確認してください。"
    } as any,
    noPublicKey: {
      en: "Failed to get the recipient public key for encryption.",
      ja: "暗号化のための宛先の公開鍵取得に失敗しました。"
    } as any
  };
}
