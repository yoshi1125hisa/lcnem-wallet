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
  EmptyMessage
} from 'nem-library';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { AssetsDialogComponent } from './assets-dialog/assets-dialog.component';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  public loading = true;

  public recipient = "";
  public message = "";
  public encrypt = false;

  public autoCompletes: string[] = [];
  public transferAssets: {
    asset: Asset,
    visible: boolean,
    name: string,
    amount?: number
  }[] = [];

  constructor(
    public global: GlobalDataService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.global.auth.authState.subscribe((user) => {
      if (user == null) {
        this.router.navigate(["accounts", "login"]);
        return;
      }
      this.global.initialize().then(() => {
        this.transferAssets = this.global.assets!.map(asset => {
          return {
            asset: asset,
            visible: false,
            name: asset.assetId.namespaceId + ":" + asset.assetId.name
          }
        });

        if(this.global.buffer) {
          this.recipient = this.global.buffer.address;
          this.message = this.global.buffer.message;
        }
        
        if (this.global.buffer && this.global.buffer.mosaics) {
          this.global.buffer.assets.forEach((asset: any) => {
            let index = this.transferAssets.findIndex(_asset => _asset.name == asset.name);
            if (index != -1) {
              this.transferAssets[index].visible = true;
              this.transferAssets[index].amount = asset.amount / Math.pow(10, this.global.definitions![asset.name].properties.divisibility);
            }
          })
        } else {
          this.changeTransferAssets();
        }
        this.global.buffer = null;

        this.loading = false;
      });
    });
  }

  public async onRecipientChange() {
    let resolved = "";
    try {
      let result = await this.global.namespaceHttp.getNamespace(this.recipient).toPromise();
      resolved = result.owner.pretty();
      this.autoCompletes = [resolved];
    } catch {
      
    }
  }

  public async changeTransferAssets() {
    this.dialog.open(AssetsDialogComponent, {
      data: {
        title: this.translation.changeMosaic[this.global.lang],
        assets: this.transferAssets.filter(m => !m.visible).map(m => m.asset)
      }
    }).afterClosed().subscribe(async (result: MatListOption[]) => {
      if (!result) {
        return;
      }

      this.transferAssets.forEach(m => {
        if (result.find(opt => opt.value == m.name)) {
          m.visible = true;
        }
      });
    });
  }

  public async transfer() {
    let address: Address;
    try {
      address = new Address(this.recipient!);
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
    if (this.encrypt) {
      try {
        let meta = await this.global.accountHttp.getFromAddress(address).toPromise();
        if(!meta.publicAccount) {
          throw Error();
        }
        message = this.global.account!.encryptMessage(this.message, meta.publicAccount);
      } catch {
        this.dialog.open(AlertDialogComponent, {
          data: {
            title: this.translation.error[this.global.lang],
            content: this.translation.noPublicKey[this.global.lang]
          }
        });
        return;
      }
    } else {
      if(!this.message) {
        message = EmptyMessage;
      } else {
        message = PlainMessage.create(this.message);
      }
    }

    let transferMosaics: AssetTransferable[] = [];
    for (let i = 0; i < this.transferAssets.length; i++) {
      let m = this.transferAssets[i];
      if (!m.visible) {
        continue;
      }
      if (m.name == "nem:xem") {
        transferMosaics.push(new XEM(m.amount!));
      } else {
        let absolute = m.amount! * Math.pow(10, this.global.definitions![m.name].properties.divisibility);
        transferMosaics.push(AssetTransferable.createWithAssetDefinition(this.global.definitions![m.name], absolute));
      }
    };
    if (!transferMosaics.length) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: this.translation.error[this.global.lang],
          content: this.translation.noMosaic[this.global.lang]
        }
      });
      return;
    }

    let transaction = TransferTransaction.createWithMosaics(
      TimeWindow.createWithDeadline(),
      address,
      transferMosaics,
      message
    );

    this.dialog.open(TransferDialogComponent, {
      data: {
        transaction: transaction,
        message: this.message
      }
    }).afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }
      let dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

      let signed = this.global.account!.signTransaction(transaction);
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

      this.dialog.open(AlertDialogComponent, {
        data: {
          title: this.translation.completed[this.global.lang],
          content: ""
        }
      }).afterClosed().subscribe(() => {
        this.router.navigate(["/"]);
      })
    });
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
      en: "An address is required.",
      ja: "アドレスを入力してください。"
    } as any,
    invalidNamespace: {
      en: "Failed to resolve the namespace.",
      ja: "ネームスペース解決に失敗しました。"
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
    changeMosaic: {
      en: "Change assets to transfer",
      ja: "送信するアセットの変更"
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
    noMosaic: {
      en: "There is no asset to transfer.",
      ja: "送信するアセットがありません。"
    } as any,
    noPublicKey: {
      en: "Failed to get the recipient public key for encryption.",
      ja: "暗号化のための宛先の公開鍵取得に失敗しました。"
    } as any
  };
}
