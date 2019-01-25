import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar, MatSlideToggleChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Address,
  PlainMessage,
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
  SignedTransaction
} from 'nem-library';
import { Observable, of, from, combineLatest, BehaviorSubject } from 'rxjs';
import { mergeMap, first, map, filter, catchError } from 'rxjs/operators';
import { WalletService } from '../../../services/wallet/wallet.service';
import { BalanceService } from '../../../services/dlt/nem/balance/balance.service';
import { LanguageService } from '../../../services/language/language.service';
import { Invoice } from '../../../classes/invoice';
import { RouterService } from '../../../services/router/router.service';
import { ShareService } from '../../../services/api/share/share.service';
import { AuthService } from '../../../services/auth/auth.service';
import { nodes } from '../../../classes/nodes';
import { AssetDefinitionService } from '../../../services/dlt/asset-definition/asset-definition.service';
import { TransferDialogComponent } from '../../../components/transfer-dialog/transfer-dialog.component';
import { Tuple } from '../../../classes/tuple';
import { LoadingDialogComponent } from '../../../components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit, OnDestroy {
  public get lang() { return this.language.state.twoLetter; }

  public forms = {
    recipient: "",
    recipient$: new BehaviorSubject<TextEvent | undefined>(undefined),
    message: "",
    message$: new BehaviorSubject<TextEvent | undefined>(undefined),
    encryption: "",
    encryption$: new BehaviorSubject<MatSlideToggleChange | undefined>(undefined),
    transferAssets: [] as {
      id: string,
      amount?: number,
      balance$: Observable<Asset>
    }[]
  }

  public loading$ = combineLatest(
    this.wallet.state$,
    this.balance.state$
  ).pipe(
    map(([wallet, balance]) => wallet.loading || balance.loading)
  )

  public balance$ = this.balance.state$.pipe(map(state => state.assets))

  public account$ = combineLatest(
    this.auth.user$,
    this.wallet.state$
  ).pipe(
    map(([user, wallet]) => Tuple(new Password(user!.uid), wallet.entities[wallet.currentWalletId!].wallet!)),
    map(([password, wallet]) => SimpleWallet.readFromWLT(wallet).open(password)),
    catchError(error => of(null))
  )

  public recipient$ = this.forms.recipient$.asObservable().pipe(
    filter(event => !!event),
    map(event => (event!.target as HTMLInputElement).value),
    map(value => new Address(value)),
    catchError(error => of(null))
  )

  public message$ = combineLatest(
    this.recipient$.pipe(
      map(recipient => Tuple(recipient, new AccountHttp(nodes))),
      mergeMap(([recipient, accountHttp]) => accountHttp.getFromAddress(recipient!)),
      map(meta => meta.publicAccount),
      catchError(error => of(null))
    ),
    this.forms.message$.asObservable().pipe(
      map(event => event && (event!.target as HTMLInputElement).value || "")
    ),
    this.forms.encryption$.pipe(
      map(event => event && event.checked)
    ),
    this.account$
  ).pipe(
    map(
      ([recipient, message, encryption, account]) => encryption
        ? account!.encryptMessage(message, recipient!)
        : PlainMessage.create(message)
    ),
    catchError(error => of(null))
  )

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _router: RouterService,
    private language: LanguageService,
    private auth: AuthService,
    private wallet: WalletService,
    private balance: BalanceService,
    private assetDefinition: AssetDefinitionService,
    private share: ShareService
  ) {
  }

  ngOnInit() {
    this.load()
  }

  ngOnDestroy() {
    this.forms.recipient$.complete()
    this.forms.message$.complete()
    this.forms.encryption$.complete()
  }

  public async load() {
    const state = await this.wallet.state$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise()

    this.balance.loadBalance(new Address(state.entities[state.currentWalletId!].nem))

    let invoice = this.route.snapshot.queryParamMap.get('invoice') || ""
    let invoiceData = Invoice.parse(decodeURI(invoice))

    if (invoiceData) {
      this.forms.recipient = invoiceData.data.addr
      this.forms.message = invoiceData.data.msg

      if (invoiceData.data.assets) {
        for (let asset of invoiceData.data.assets) {
          this.addTransferAsset(asset.id, asset.amount)
        }
      }
    }
  }

  public back() {
    this._router.back([""])
  }

  public addTransferAsset(id: string, amount?: number) {
    if (!id) {
      return
    }
    if (this.forms.transferAssets.find(asset => asset.id === id)) {
      return
    }
    this.forms.transferAssets.push(
      {
        id: id,
        amount: amount,
        balance$: this.balance.state$.pipe(
          mergeMap(state => from(state.assets)),
          filter(asset => asset.assetId.toString() === id)
        )
      }
    )
  }

  public deleteTransferAsset(index: number) {
    this.forms.transferAssets.splice(index, 1)
  }

  public shareInvoice() {
    const invoice = new Invoice();
    invoice.data.addr = this.forms.recipient;
    invoice.data.msg = this.forms.message;
    invoice.data.assets = this.forms.transferAssets.map(
      (asset) => {
        return { id: asset.id, amount: asset.amount || 0 }
      }
    )

    const url = location.href + "?invoice=" + encodeURI(invoice.stringify())

    if (!(navigator as any).share) {
      this.share.copy(url)
      this.snackBar.open(this.translation.copyCompleted[this.lang], undefined, { duration: 6000 });
      return
    }
    this.share.share(url, "LCNEM Wallet")
  }

  public getMosaicTransferable() {
    return this.forms.transferAssets.map(
      (asset) => {
        if (asset.id == "nem:xem") {
          return new XEM(asset.amount || 0)
        }
        const definition = this.assetDefinition.state.definitions.find(definition => definition.id.toString() === asset.id)!
        const amount = (asset.amount || 0) * Math.pow(10, definition.properties.divisibility)

        return AssetTransferable.createWithAssetDefinition(definition, amount)
      }
    )
  }

  public async transfer() {
    combineLatest(
      this.account$,
      this.recipient$,
      this.message$
    ).pipe(
      first()
    ).subscribe(
      async ([account, recipient, message]) => {
        if (!account) {
          this.openDialog("import")
          return
        }
        if (!message) {
          this.openDialog("message")
          return
        }
        const transaction = TransferTransaction.createWithAssets(
          TimeWindow.createWithDeadline(),
          recipient!,
          this.getMosaicTransferable(),
          message
        )

        const result = await this.dialog.open(
          TransferDialogComponent,
          {
            data: {
              transaction: transaction,
              message: this.forms.message
            }
          }
        ).afterClosed().toPromise()

        if (!result) {
          return
        }

        const signed = account!.signTransaction(transaction)
        this.announceTransaction(signed)
      }
    )
  }

  public announceTransaction(signed: SignedTransaction) {
    const dialog = this.dialog.open(LoadingDialogComponent, { disableClose: true })

    const transactionHttp = new TransactionHttp(nodes)
    transactionHttp.announceTransaction(signed).subscribe(
      () => {
        this.snackBar.open(this.translation.completed[this.lang], undefined, { duration: 6000 })
        this.router.navigate([""])
      },
      (error) => {
        this.snackBar.open(this.translation.error[this.lang], undefined, { duration: 6000 })
      },
      () => {
        dialog.close()
      }
    )
  }

  public openDialog(type: string) {
    if (type == "import") {
      this.snackBar.open(this.translation.importRequired[this.lang], undefined, { duration: 6000 })
      return
    }
    if (type == "message") {
      this.snackBar.open(this.translation.noPublicKey[this.lang], undefined, { duration: 6000 })
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
      en: "Completed. Please confirm later that the transaction be confirmed by blockchain.",
      ja: "送信しました。ブロックチェーンに承認されたことを確認してください。"
    } as any,
    noPublicKey: {
      en: "Failed to get the recipient public key for encryption.",
      ja: "暗号化のための宛先の公開鍵取得に失敗しました。"
    } as any,
    copyCompleted: {
      en: "Copied",
      ja: "コピーしました"
    } as any
  }
}
