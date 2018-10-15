import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalDataService } from '../../services/global-data.service';
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
  AssetLevyType
} from 'nem-library';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  public loading = true;
  public assets: Asset[] = [];

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

  constructor(
    public global: GlobalDataService,
    public dialog: MatDialog,
    private router: Router,
    private auth: AngularFireAuth
  ) {
  }

  ngOnInit() {
    this.auth.authState.subscribe(async (user) => {
      if (user == null) {
        this.router.navigate(["accounts", "login"]);
        return;
      }
      await this.global.initialize();
      await this.initialize();
      
      this.loading = false;
    });
  }

  public async initialize() {
    if (this.global.buffer) {
      this.forms.recipient = this.global.buffer.address;
      this.forms.message = this.global.buffer.message;
    }

    if (this.global.buffer && this.global.buffer.mosaics) {
      this.global.buffer.assets.forEach((bufferAsset: any) => {
        let index = this.global.account.assets.findIndex(a => a.asset.assetId.namespaceId + ":" + a.asset.assetId.name == bufferAsset.name);
        if (index != -1) {
          let amount = bufferAsset.amount / Math.pow(10, this.global.account.assets[index].definition.properties.divisibility);
          this.forms.transferAssets.push({
            name: bufferAsset.name,
            amount: amount
          })
        }
      })
    }
    this.global.buffer = null;
    this.assets = this.global.account.assets.map(a => a.asset);
  }

  public addAsset(index: number) {
    this.forms.transferAssets[index].name = this.global.account.assets[this.forms.transferAssets[index].index!].name;

    if (index != this.forms.transferAssets.length - 1) {
      return;
    }
    this.forms.transferAssets.push({});
  }

  public deleteAsset(index: number) {
    this.forms.transferAssets.splice(index, 1);
  }

  public assetIsNotReady(name: string) {
    return this.forms.transferAssets.findIndex(a => a.name == name) == -1;
  }

  public async onRecipientChange() {
    let resolved = "";
    try {
      let result = await this.global.namespaceHttp.getNamespace(this.forms.recipient).toPromise();
      resolved = result.owner.plain();
      this.autoCompletes = [this.forms.recipient.replace("-", ""), resolved];
    } catch {

    }
  }

  public async transfer() {
    let password = new Password(this.auth.auth.currentUser!.uid);
    let account = this.global.account.wallet.open(password);

    let recipient: Address;
    try {
      recipient = new Address(this.forms.recipient!);
    } catch {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: this.translation.error[this.global.lang],
          content: this.translation.addressRequired[this.global.lang]
        }
      });
      return;
    }

    let message: Message;
    if (this.forms.encrypt) {
      let meta = await this.global.accountHttp.getFromAddress(recipient).toPromise();
      if (!meta.publicAccount) {
        this.dialog.open(AlertDialogComponent, {
          data: {
            title: this.translation.error[this.global.lang],
            content: this.translation.noPublicKey[this.global.lang]
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

    let levy: Asset[] = [];

    let transferMosaics: AssetTransferable[] = this.forms.transferAssets.filter(asset => asset.name).map(asset => {
      if (asset.name == "nem:xem") {
        return new XEM(asset.amount!);
      }
      let definition = this.global.account.assets.find(a => a.asset.assetId.namespaceId + ":" + a.asset.assetId.name == asset.name)!.definition;

      let absolute = asset.amount! * Math.pow(10, definition.properties.divisibility);
      
      if(definition.levy) {
        if(definition.levy.type == AssetLevyType.Absolute) {
          levy.push(new Asset(definition.levy.assetId, definition.levy.fee));
        } else if(definition.levy.type == AssetLevyType.Percentil) {
          levy.push(new Asset(definition.levy.assetId, definition.levy.fee * absolute / 10000));
        }
      }

      return AssetTransferable.createWithAssetDefinition(definition, absolute);
    });

    let transaction = TransferTransaction.createWithMosaics(
      TimeWindow.createWithDeadline(),
      recipient,
      transferMosaics,
      message
    );

    let result = await this.dialog.open(TransferDialogComponent, {
      data: {
        transaction: transaction,
        message: this.forms.message,
        levy: levy
      }
    }).afterClosed().toPromise();
    if (!result) {
      return;
    }

    let dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

    let signed = account.signTransaction(transaction);
    try {
      await this.global.transactionHttp.announceTransaction(signed).toPromise();
    } catch {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: this.translation.error[this.global.lang],
          content: ""
        }
      });
      return;
    } finally {
      dialogRef.close();
    }

    await this.dialog.open(AlertDialogComponent, {
      data: {
        title: this.translation.completed[this.global.lang],
        content: ""
      }
    }).afterClosed().toPromise();

    this.router.navigate(["/"]);
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
    addressRequired: {
      en: "An address without hyphen is required.",
      ja: "アドレスをハイフンなしで入力してください。NEMネームスペースを入力することもできます。"
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
