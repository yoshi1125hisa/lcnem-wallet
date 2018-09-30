import { Component, OnInit, Input } from '@angular/core';

import {
  Address,
  EncryptedMessage,
  Transaction,
  TransactionTypes,
  TransferTransaction,
  MultisigTransaction,
  PlainMessage,
  Mosaic,
  XEM,
  MosaicId
} from 'nem-library';
import { GlobalDataService } from '../../../services/global-data.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  @Input() public transaction?: Transaction;

  public loading = true;

  public address?: string;
  public mosaics?: Mosaic[];
  public message?: string;
  public date?: any;
  public time?: any;
  public received = true;

  constructor(public global: GlobalDataService) { }

  ngOnInit() {
    if(!this.transaction) {
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
    let account = this.global.account!;
    if (account!.address.plain() == transferTransaction.recipient.plain()) {
      this.address = transferTransaction.signer!.address.pretty();
    } else {
      this.address = transferTransaction.recipient.pretty();
      this.received = false;
    }

    let message: string;
    if (transferTransaction.message.isEncrypted()) {
      if(this.received) {
        message = account!.decryptMessage(transferTransaction.message, transferTransaction.signer!).payload;
      } else {
        let recipient = await this.global.accountHttp.getFromAddress(transferTransaction.recipient).toPromise();
        message = account!.decryptMessage(transferTransaction.message, recipient.publicAccount!).payload;
      }
    } else {
      let msg = transferTransaction.message as PlainMessage;
      message = msg.plain();
    }
    this.message = message;

    if (transferTransaction.containsMosaics()) {
      this.mosaics = transferTransaction.mosaics();
    } else {
      this.mosaics = [new Mosaic(new MosaicId("nem", "xem"), transferTransaction.xem().quantity)];
    }

    this.date = transferTransaction.timeWindow.timeStamp.toLocalDate();
    this.time = transferTransaction.timeWindow.timeStamp.toLocalTime();

    this.loading = false;
  }

  public translation = {
    mosaics: {
      en: "Assets",
      ja: "アセット"
    },
    unconfirmed: {
      en: "This transaction is not confirmed by the blockchain yet.",
      ja: "この取引はまだブロックチェーンに承認されていません"
    }
  };
}
