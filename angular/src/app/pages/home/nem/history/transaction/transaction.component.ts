import { Component, Input, OnInit, OnChanges } from '@angular/core';

import {
  Transaction,
  TransactionTypes,
  TransferTransaction,
  MultisigTransaction,
  PlainMessage,
  Asset,
  AssetId,
  Password,
  SimpleWallet,
  AccountHttp,
  PublicAccount,
  Message
} from 'nem-library';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { LanguageService } from '../../../../../services/language/language.service';
import { nodes } from '../../../../../classes/nodes';
import { AuthService } from '../../../../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import { State } from '../../../../../services/reducer';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit, OnChanges {
  public get lang() { return this.language.code }

  @Input() transaction?: Transaction

  public wallet$ = this.store.select(state => state.wallet)
  private _transaction?: Transaction

  public address = ""
  public message = ""

  public icon = "business"
  public confirmed = false
  public multisig = false

  public assets: Asset[] = []
  public date = ""

  constructor(
    private snackBar: MatSnackBar,
    private language: LanguageService,
    private auth: AuthService,
    private store: Store<State>
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    this.load()
  }

  private async load() {
    if (!this.transaction) {
      return;
    }

    this.confirmed = this.transaction.isConfirmed()

    switch (this.transaction.type) {
      case TransactionTypes.MULTISIG: {
        this._transaction = (this.transaction as MultisigTransaction).otherTransaction
        this.address = this.transaction.signer!.address.pretty()
        this.multisig = true
        break;
      }

      default: {
        this._transaction = this.transaction
        this.address = this._transaction.signer!.address.pretty()
        break;
      }
    }


    this.date = `${this._transaction.timeWindow.timeStamp.toLocalDate()} ${this._transaction.timeWindow.timeStamp.toLocalTime()}`

    switch (this._transaction.type) {
      case TransactionTypes.TRANSFER: {
        const transferTransaction = this._transaction as TransferTransaction
        const wallet = await this.wallet$.pipe(
          map(state => state.entities[state.currentWalletId!])
        ).toPromise()

        if (transferTransaction.recipient.plain() === wallet.nem) {
          this.icon = "call_received"
        } else {
          this.icon = "call_made"
          this.address = transferTransaction.recipient.pretty()
        }

        if (transferTransaction.message.isPlain()) {
          this.message = (transferTransaction.message as PlainMessage).plain()
        } else if (transferTransaction.message.isEncrypted()) {
          const accountHttp = new AccountHttp(nodes);
          accountHttp.getFromAddress(transferTransaction.recipient).pipe(
            map(meta => meta.publicAccount)
          ).subscribe(
            async (recipient) => {
              this.message = await this.decryptMessage(transferTransaction.message, transferTransaction.signer!, recipient!)
            }
          )
        }

        if (transferTransaction.containAssets()) {
          this.assets = transferTransaction.assets();
        } else {
          this.assets = [new Asset(new AssetId("nem", "xem"), transferTransaction.xem().quantity)];
        }

        break
      }
    }
  }

  private async decryptMessage(message: Message, signer: PublicAccount, recipient: PublicAccount) {
    const wallet = await this.wallet$.pipe(
      map(state => state.entities[state.currentWalletId!])
    ).toPromise()

    if (!wallet.wallet) {
      return this.translation.importRequired[this.lang]
    }

    const password = new Password(this.auth.user!.uid)
    const account = SimpleWallet.readFromWLT(wallet.wallet).open(password)

    if (account.address.equals(signer.address)) {
      return account.decryptMessage(message, recipient)
    }

    return account.decryptMessage(message, signer)
  }

  public openSnackBar(type: string) {
    this.snackBar.open(this.translation.snackBar[type][this.lang], undefined, { duration: 6000 });
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
    } as any,
    snackBar: {
      confirmed: {
        en: "This transaction has been confirmed.",
        ja: "この取引はブロックチェーンに承認されています。"
      } as any,
      unconfirmed: {
        en: "This transaction is not confirmed yet.",
        ja: "この取引はまだブロックチェーンに承認されていません。"
      } as any,
      call_made: {
        en: "The type of this transaction is \"Asset transfer.\"",
        ja: "アセット送信トランザクションです。"
      } as any,
      call_received: {
        en: "The type of this transaction is \"Asset receiving.\"",
        ja: "アセット受信トランザクションです。"
      } as any,
      business: {
        en: "The type of this transaction is \"Others.\"",
        ja: "その他のトランザクションです。"
      } as any,
      multisig: {
        en: "The type of this transaction is \"Multisig.\"",
        ja: "マルチシグトランザクションです。"
      } as any
    } as any,
  };
}
