import { Component, OnInit, Input } from '@angular/core';

import {
  Address,
  Transaction,
  TransactionTypes,
  TransferTransaction,
  MultisigTransaction,
  PlainMessage,
  Asset,
  XEM,
  AssetId,
  Password
} from 'nem-library';
import { GlobalDataService } from '../../../services/global-data.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  @Input() public transaction?: Transaction;

  public loading = true;

  public address?: string;
  public assets?: Asset[];
  public message?: string;
  public date?: any;
  public time?: any;
  public received = true;

  constructor(
    public global: GlobalDataService,
    private auth: AngularFireAuth
  ) { }

  ngOnInit() {
    if (!this.transaction) {
      return;
    }
    if (this.transaction.type == TransactionTypes.TRANSFER) {
      this.set(this.transaction as TransferTransaction);
    } else if (this.transaction.type == TransactionTypes.MULTISIG) {
      let mt = this.transaction as MultisigTransaction;
      if (mt.otherTransaction.type == TransactionTypes.TRANSFER) {
        this.set(mt.otherTransaction as TransferTransaction);
      }
    }
  }

  public async set(transferTransaction: TransferTransaction) {
    if (this.global.account.currentWallet!.address.plain() == transferTransaction.recipient.plain()) {
      this.address = transferTransaction.signer!.address.pretty();
    } else {
      this.address = transferTransaction.recipient.pretty();
      this.received = false;
    }

    let message: string;
    if (transferTransaction.message.isEncrypted()) {
      if (this.global.account.currentWallet!.wallet) {
        message = "";
      } else {
        let password = new Password(this.auth.auth.currentUser!.uid);
        let account = this.global.account.currentWallet!.wallet!.open(password);
        if (this.received) {
          message = account!.decryptMessage(transferTransaction.message, transferTransaction.signer!).payload;
        } else {
          let recipient = await this.global.accountHttp.getFromAddress(transferTransaction.recipient).toPromise();
          message = account!.decryptMessage(transferTransaction.message, recipient.publicAccount!).payload;
        }
      }
    } else {
      let msg = transferTransaction.message as PlainMessage;
      message = msg.plain();
    }
    this.message = message;

    if (transferTransaction.containsMosaics()) {
      this.assets = transferTransaction.mosaics();
    } else {
      this.assets = [new Asset(new AssetId("nem", "xem"), transferTransaction.xem().quantity)];
    }

    this.date = transferTransaction.timeWindow.timeStamp.toLocalDate();
    this.time = transferTransaction.timeWindow.timeStamp.toLocalTime();

    this.loading = false;
  }

  public translation = {
    assets: {
      en: "Assets",
      ja: "アセット"
    } as any,
    unconfirmed: {
      en: "This transaction is not confirmed by the blockchain yet.",
      ja: "この取引はまだブロックチェーンに承認されていません"
    } as any,
    importRequired: {
      en: "To decrypt an encrypted message, importing the private key is required.",
      ja: "暗号化メッセージを復号するには、秘密鍵のインポートが必要です。"
    } as any
  };
}