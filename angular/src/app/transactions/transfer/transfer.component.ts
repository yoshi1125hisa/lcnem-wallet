import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Address,
  PlainMessage,
  EncryptedMessage,
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
  NamespaceHttp,
  AccountHttp,
  TransactionHttp
} from 'nem-library';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { Invoice } from '../../../models/invoice';
import { lang } from '../../../models/lang';
import { WalletsService } from '../../../app/services/wallets.service';
import { BalanceService } from '../../../app/services/balance.service';
import { nodes } from '../../../models/nodes';
import { back } from '../../../models/back';
import { UserService } from '../../services/user.service';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  public loading = true;
  get lang() { return lang; }
  public address!: Address;
  public assets: Asset[] = [];
  public assetIds: string[] = [];

  public forms = {
    recipient: "",
    message: "",
    encrypt: false,
    transferAssets: [{}] as {
      index?: number,
      amount?: number
    }[]
  };

  public suggests: string[] = [];

  public navigatorShare = (navigator as any).share;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AngularFireAuth,
    private user: UserService,
    private wallet: WalletsService,
    private balance: BalanceService,
    private contact: ContactsService
  ) {
  }

  ngOnInit() {
    this.user.checkLogin().then(async () => {
      await this.wallet.checkWallets();
      await this.refresh();
    });
  }

  public async refresh() {
    this.loading = true;

    await Promise.all([this.balance.readAssets(), this.contact.readContacts()]);

    this.address = new Address(this.wallet.wallets![this.wallet.currentWallet!].nem);
    this.assets = this.balance.assets!;
    this.assetIds = this.balance.assets!.map(a => a.assetId.namespaceId + ":" + a.assetId.name);

    let invoice = this.route.snapshot.queryParamMap.get('invoice') || "";
    let invoiceData = Invoice.parse(decodeURI(invoice));

    if (invoiceData) {
      this.forms.recipient = invoiceData.data.addr;
      this.forms.message = invoiceData.data.msg;

      if (invoiceData.data.assets) {
        for (let asset of invoiceData.data.assets) {
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
    let asset = this.assetIds.find(a => a == id);
    if (!asset || !this.assetIsNotReady(id)) {
      return
    }
    let index = this.forms.transferAssets.length - 1;
    this.forms.transferAssets[index].index = this.assetIds.findIndex(a => a == id);
    this.forms.transferAssets[index].amount = amountAbsolute / Math.pow(10, (await this.balance.readDefinition(id)).properties.divisibility);
  }

  public assetIsNotReady(id: string) {
    for (let asset of this.forms.transferAssets) {
      if (!asset.index) {
        continue;
      }
      if (this.assetIds[asset.index!] == id) {
        return false;
      }
    }
    return true;
  }

  public spliceAsset(index: number) {
    this.forms.transferAssets.splice(index, 1);
  }

  public pushAsset() {
    this.forms.transferAssets.push({});
  }

  public async share() {
    let invoice = new Invoice();
    invoice.data.addr = this.forms.recipient;
    invoice.data.msg = this.forms.message;
    invoice.data.assets = (await this.getTransferMosaics()).assets.map(asset => {
      return { id: asset.assetId.toString(), amount: asset.absoluteQuantity() }
    }
    );

    (navigator as any).share({
      title: "LCNEM Wallet",
      url: location.href + "?invoice=" + encodeURI(invoice.stringify())
    })
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
      en: "An address is required. You can also enter any NEM namespace or contact.",
      ja: "アドレスを入力してください。NEMネームスペース、コンタクトを入力することもできます。"
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
