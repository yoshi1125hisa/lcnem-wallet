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
  Password,
  SimpleWallet,
  AccountHttp
} from 'nem-library';
import { AngularFireAuth } from '@angular/fire/auth';
import { lang } from '../../../../models/lang';
import { WalletsService } from '../../../services/wallets.service';
import { nodes } from '../../../../models/nodes';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  get lang() { return lang; }

  @Input() public transaction?: Transaction;

  public address?: string;
  public assets?: Asset[];
  public message?: string;
  public date?: any;
  public time?: any;
  public received = true;

  constructor(
    private auth: AngularFireAuth,
    private wallet: WalletsService
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
    let address = new Address(this.wallet.wallets![this.wallet.currentWallet!].nem);
    let wallet = this.wallet.wallets![this.wallet.currentWallet!].wallet;
    let accountHttp = new AccountHttp(nodes);

    if (address.plain() == transferTransaction.recipient.plain()) {
      this.address = transferTransaction.signer!.address.pretty();
    } else {
      this.address = transferTransaction.recipient.pretty();
      this.received = false;
    }

    let message: string;
    if (transferTransaction.message.isEncrypted()) {
      if (!wallet) {
        message = "";
      } else {
        let password = new Password(this.auth.auth.currentUser!.uid);
        let account = SimpleWallet.readFromWLT(wallet).open(password);
        if (this.received) {
          message = account!.decryptMessage(transferTransaction.message, transferTransaction.signer!).payload;
        } else {
          let recipient = await accountHttp.getFromAddress(transferTransaction.recipient).toPromise();
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
