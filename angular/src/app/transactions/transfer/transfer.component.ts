import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
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
  EmptyMessage,
  Password,
  AssetLevyType,
  SimpleWallet,
  AccountHttp,
  TransactionHttp
} from 'nem-library';
import { Observable, of, Subscription } from 'rxjs';
import { mergeMap, first, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '../../store/index'
import { LanguageService } from '../../services/language/language.service';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { Wallet } from '../../store/wallet/wallet.model';
import { Back, Navigate } from '../../store/router/router.actions';
import { LoadBalances } from '../../store/nem/balance/balance.actions';
import { Invoice } from '../../models/invoice';
import { nodes } from '../../models/nodes';
import { WebShareApi } from '../../store/api/share/share.actions';
import { AngularFireAuth } from '@angular/fire/auth';
import { SendTransferTransaction } from '../../store/nem/transaction/transaction.actions';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  public get lang() { return this.language.twoLetter; }

  public loading$: Observable<boolean>;
  public assets$: Observable<Asset[]>;

  private loadingDialog?: MatDialogRef<LoadingDialogComponent>;
  private subscriptions: Subscription[] = [];

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

  constructor(
    private store: Store<State>,
    private auth: AngularFireAuth,
    private language: LanguageService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.loading$ = this.store.select(state => state.nemBalance.loading);

    this.assets$ = this.store.select(state => state.nemBalance.assets);

    this.subscriptions.push(
      this.store.select(state => state.NemTransaction).subscribe(
        (state) => {
          if (state.loading && !this.loadingDialog) {
            this.loadingDialog = this.dialog.open(LoadingDialogComponent, { disableClose: true });
          } else if (this.loadingDialog) {
            this.loadingDialog.close();

            if (state.error) {
              this.dialog.open(
                AlertDialogComponent,
                {
                  data: {
                    title: this.translation.error[this.lang],
                    content: ""
                  }
                }
              );
              return;
            }

            this.dialog.open(
              AlertDialogComponent,
              {
                data: {
                  title: this.translation.completed[this.lang],
                  content: this.translation.completedBody[this.lang]
                }
              }
            ).afterClosed().subscribe(
              (_) => {
                this.store.dispatch(new Navigate({ commands: [""] }));
              }
            );
          }
        }
      )
    )
  }

  ngOnInit() {
    this.load();
  }

  public load() {
    this.store.select(state => state.wallet).pipe(first()).subscribe(
      (wallet) => {
        this.store.dispatch(
          new LoadBalances(
            {
              address: new Address(wallet.entities[wallet.currentWallet!].nem)
            }
          )
        );
      }
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
    this.store.dispatch(new Back({ commands: [""] }));
  }

  public addTransferAsset(id: string, amount?: number) {
    this.forms.transferAssets.push(
      {
        id: id,
        amount: amount,
        balance: this.store.select(state => state.nemBalance.assets).pipe(
          map(
            (assets) => {
              return assets.find(
                (asset) => {
                  return id == asset.assetId.toString()
                }
              )!
            }
          )
        )
      }
    );
  }

  public deleteTransferAsset(index: number) {
    this.forms.transferAssets.splice(index, 1);
  }

  public share() {
    let invoice = new Invoice();
    invoice.data.addr = this.forms.recipient;
    invoice.data.msg = this.forms.message;
    invoice.data.assets = this.forms.transferAssets.map(
      (asset) => {
        return { id: asset.id, amount: asset.amount || 0 }
      }
    );

    this.store.dispatch(new WebShareApi({
      title: "LCNEM Wallet",
      url: location.href + "?invoice=" + encodeURI(invoice.stringify())
    }));
  }

  public transfer() {
    let wallet = this.wallet.wallets![this.wallet.currentWallet!].wallet;
    if (!wallet) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: this.translation.error[this.lang],
          content: this.translation.importRequired[this.lang]
        }
      });
      return;
    }

    const password = new Password(this.auth.auth.currentUser!.uid);
    const account = SimpleWallet.readFromWLT(wallet).open(password);

    const recipient = new Address(this.forms.recipient!);

    let message: Message;
    if (this.forms.encrypt) {
      let accountHttp = new AccountHttp(nodes);
      let meta = await accountHttp.getFromAddress(recipient).toPromise();
      if (!meta.publicAccount) {
        this.dialog.open(AlertDialogComponent, {
          data: {
            title: this.translation.error[this.lang],
            content: this.translation.noPublicKey[this.lang]
          }
        });
        return;
      }
      message = account.encryptMessage(this.forms.message, meta.publicAccount);
    } else {
      if (!this.forms.message) {
        message = EmptyMessage;
      } else {
        message = PlainMessage.create(this.forms.message);
      }
    }

    const mosaics = this.forms.transferAssets.map(
      (asset) => {
        if(asset.id == "nem:xem") {
          return new XEM(asset.amount || 0);
        }

        return new mosaictransferable
      }
    )

    let transaction = TransferTransaction.createWithMosaics(
      TimeWindow.createWithDeadline(),
      recipient,
      transferMosaics.assets,
      message
    );

    this.dialog.open(TransferDialogComponent, {
      data: {
        transaction: transaction,
        message: this.forms.message
      }
    }).afterClosed().subscribe(
      (result) => {
        if (!result) {
          return;
        }
    
        const signed = account.signTransaction(transaction);

        this.store.dispatch(
          new SendTransferTransaction(
            {
              signedTransaction: signed
            }
          )
        )
      }
    )

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
