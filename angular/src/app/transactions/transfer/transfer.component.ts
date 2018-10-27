import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatListOption } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Address,
  PublicAccount,
  PlainMessage,
  EncryptedMessage,
  Message,
  TransferTransaction,
  Asset,
  AssetId,
  AssetDefinition,
  TimeWindow,
  AssetTransferable,
  XEM,
  EmptyMessage,
  Password,
  AssetLevyType,
  SimpleWallet,
  NamespaceHttp,
  AccountHttp,
  TransactionHttp
} from 'nem-library';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { Invoice } from '../../../models/invoice';
import { lang } from 'src/models/lang';
import { WalletsService } from 'src/app/services/wallets.service';
import { BalanceService } from 'src/app/services/balance.service';
import { nodes } from 'src/models/nodes';
import { back } from 'src/models/back';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  public loading = true;
  get lang() { return lang; }
  public currentWallet!: SimpleWallet;
  public assets: string[] = [];

  public forms = {
    recipient: "",
    message: "",
    encrypt: false,
    transferAssets: [{}] as {
      index?: number,
      name?: string,
      amount?: number
    }[]
  };

  public autoCompletes: string[] = [];

  public navigatorShare = (navigator as any).share;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AngularFireAuth,
    private wallet: WalletsService,
    private balance: BalanceService
  ) {
  }

  ngOnInit() {
    this.auth.authState.subscribe(async (user) => {
      if (user == null) {
        this.router.navigate(["accounts", "login"]);
        return;
      }
      if(!this.wallet.currentWallet) {
        this.router.navigate(["accounts", "wallets"]);
        return;
      }
      await this.refresh();
    });
  }

  public async refresh() {
    this.loading = true;

    await this.balance.readAssets();

    this.currentWallet = this.wallet.currentWallet!;
    this.assets = this.balance.assets!.map(a => a.assetId.namespaceId + ":" + a.assetId.name);

    let invoice = this.route.snapshot.queryParamMap.get('invoice') || "";
    let invoiceData = Invoice.parse(decodeURI(invoice));

    if(invoiceData) {
      this.forms.recipient = invoiceData.data.addr;
      this.forms.message = invoiceData.data.msg;

      if(invoiceData.data.assets) {
        for(let asset of invoiceData.data.assets) {
          this.setAsset(asset.id, asset.amount);
        }
      }
    }

    this.loading = false;
  }

  public back() {
    back(() => this.router.navigate([""]));
  }

  public async setAsset(id: string, amountAbsolute: number) {
    let asset = this.assets.find(a => a == id);
    if(!asset || !this.assetIsNotReady(id)) {
      return
    }
    let index = this.forms.transferAssets.length - 1;
    this.forms.transferAssets[index].index = index;
    this.forms.transferAssets[index].amount = amountAbsolute / Math.pow(10, (await this.balance.readDefinition(id)).properties.divisibility);
    this.addAsset(index);
  }

  public addAsset(index: number) {
    this.forms.transferAssets[index].name = this.assets![this.forms.transferAssets[index].index!];

    if (index != this.forms.transferAssets.length - 1) {
      return;
    }
    this.forms.transferAssets.push({});
  }

  public deleteAsset(index: number) {
    this.forms.transferAssets.splice(index, 1);
  }

  public assetIsNotReady(id: string) {
    return this.forms.transferAssets.findIndex(a => a.name == id) == -1;
  }

  public async onRecipientChange() {
    if(this.forms.recipient.replace(/-/g, "").trim().toUpperCase().match(/^N[A-Z2-7]{39}$/)) {
      this.forms.recipient = this.forms.recipient.replace(/-/g, "");
    }

    this.autoCompletes = [];

    let namespaceHttp = new NamespaceHttp(nodes);

    try {
      let result = await namespaceHttp.getNamespace(this.forms.recipient).toPromise();
      let resolved = result.owner.plain();
      this.autoCompletes.push(resolved);
    } catch {

    }
  }

  public async share() {
    let invoice = new Invoice();
    invoice.data.addr = this.forms.recipient;
    invoice.data.msg = this.forms.message;
    invoice.data.assets = (await this.getTransferMosaics()).assets.map(asset => {
      return { id: asset.assetId.toString(), amount: asset.absoluteQuantity() }}
    );

    (navigator as any).share({
      title: "LCNEM Wallet",
      url: location.href + "?invoice=" + encodeURI(invoice.stringify())
    })
  }

  public async getTransferMosaics() {
    let levy: Asset[] = [];

    let transferAssets: AssetTransferable[] = [];

    let filtered = this.forms.transferAssets.filter(asset => asset.name);
    for(let asset of filtered){
      if (asset.name == "nem:xem") {
        transferAssets.push(new XEM(asset.amount!));
      }
      let definition = await this.balance.readDefinition(asset.name!);

      let absolute = asset.amount! * Math.pow(10, definition.properties.divisibility);
      
      if(definition.levy) {
        if(definition.levy.type == AssetLevyType.Absolute) {
          levy.push(new Asset(definition.levy.assetId, definition.levy.fee));
        } else if(definition.levy.type == AssetLevyType.Percentil) {
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
    if(!this.currentWallet) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: this.translation.error[this.lang],
          content: this.translation.importRequired[this.lang]
        }
      });
      return;
    }

    let password = new Password(this.auth.auth.currentUser!.uid);
    let account = this.currentWallet.open(password);

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
        content: ""
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
      en: "An address is required. You can also enter any NEM namespace.",
      ja: "アドレスを入力してください。NEMネームスペースを入力することもできます。"
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
      ja: "完了"
    } as any,
    noPublicKey: {
      en: "Failed to get the recipient public key for encryption.",
      ja: "暗号化のための宛先の公開鍵取得に失敗しました。"
    } as any
  };
}
