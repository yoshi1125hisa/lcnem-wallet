import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
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
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '../../store/index'
import { LanguageService } from '../../services/language.service';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { Wallet } from '../../store/wallet/wallet.model';
import { Back } from '../../store/router/router.actions';
import { LoadBalances } from '../../store/nem/balance/balance.actions';
import { Invoice } from '../../models/invoice';
import { nodes } from '../../models/nodes';
import { WebShareApi } from 'src/app/store/api/share/share.actions';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  public get lang() { return this.language.twoLetter; }

  public currentWallet$: Observable<Wallet>;
  public assets$: Observable<Asset[]>;

  public forms = {
    recipient: "",
    message: "",
    encrypt: false,
    transferAssets: [{}] as {
      id?: string,
      amount?: number
    }[]
  };

  constructor(
    private store: Store<State>,
    private language: LanguageService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentWallet$ = this.store.select(state => state.wallet.currentWallet).pipe(
      mergeMap(id => id ? this.store.select(state => state.wallet.entities[id]) : of())
    );

    this.assets$ = this.store.select(state => state.nem.balance.assets);
  }

  ngOnInit() {
    this.load();
  }

  public load() {
    this.store.dispatch(new LoadBalances());

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

  public addTransferAsset(id?: string, amount?: number) {
    this.forms.transferAssets.push(
      {
        id: id,
        amount: amount
      }
    );
  }

  public deleteTransferAsset(index: number) {
    if (this.forms.transferAssets.length == 1) {
      this.forms.transferAssets[0] = {};
      return;
    }
    this.forms.transferAssets.splice(index, 1);
  }

  public async share() {
    let invoice = new Invoice();
    invoice.data.addr = this.forms.recipient;
    invoice.data.msg = this.forms.message;
    invoice.data.assets = (await this.getTransferMosaics()).assets.map(asset => {
      return { id: asset.assetId.toString(), amount: asset.absoluteQuantity() }
    }
    );

    this.store.dispatch(new WebShareApi({
      title: "LCNEM Wallet",
      url: location.href + "?invoice=" + encodeURI(invoice.stringify())
    }));
  }

  public async getTransferMosaics() {
    let levy: Asset[] = [];

    let transferAssets: AssetTransferable[] = [];

    for (let asset of this.forms.transferAssets) {
      let assetId = this.assetIds[asset.index!];
      if (assetId == "nem:xem") {
        transferAssets.push(new XEM(asset.amount!));
        continue;
      }
      let definition = await this.balance.readDefinition(assetId);

      let absolute = asset.amount! * Math.pow(10, definition.properties.divisibility);

      if (definition.levy) {
        if (definition.levy.type == AssetLevyType.Absolute) {
          levy.push(new Asset(definition.levy.assetId, definition.levy.fee));
        } else if (definition.levy.type == AssetLevyType.Percentil) {
          levy.push(new Asset(definition.levy.assetId, definition.levy.fee * absolute / 10000));
        }
      }

      transferAssets.push(AssetTransferable.createWithAssetDefinition(definition, absolute));
    };

    return {
      assets: transferAssets,
      levy: levy
    };
  }

  public async transfer() {
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

    let password = new Password(this.auth.auth.currentUser!.uid);
    let account = SimpleWallet.readFromWLT(wallet).open(password);

    let recipient: Address;
    try {
      recipient = new Address(this.forms.recipient!);
    } catch {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: this.translation.error[this.lang],
          content: this.translation.addressRequired[this.lang]
        }
      });
      return;
    }

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

    let transferMosaics = await this.getTransferMosaics();

    let transaction = TransferTransaction.createWithMosaics(
      TimeWindow.createWithDeadline(),
      recipient,
      transferMosaics.assets,
      message
    );

    let result = await this.dialog.open(TransferDialogComponent, {
      data: {
        transaction: transaction,
        message: this.forms.message,
        levy: transferMosaics.levy
      }
    }).afterClosed().toPromise();
    if (!result) {
      return;
    }

    let dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

    let signed = account.signTransaction(transaction);
    try {
      let transactionHttp = new TransactionHttp(nodes);
      await transactionHttp.announceTransaction(signed).toPromise();
    } catch {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: this.translation.error[this.lang],
          content: ""
        }
      });
      return;
    } finally {
      dialogRef.close();
    }

    await this.dialog.open(AlertDialogComponent, {
      data: {
        title: this.translation.completed[this.lang],
        content: this.translation.completedBody[this.lang]
      }
    }).afterClosed().toPromise();

    this.router.navigate([""]);
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
