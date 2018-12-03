import { Component, Inject, Input, OnInit } from '@angular/core';

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
import { nodes } from '../../../models/nodes';
import { LanguageService } from '../../../services/language/language.service';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../store';
import { map, mergeMap, merge } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  public get lang() { return this.language.twoLetter; }

  @Input() transaction?: Transaction;

  private _transaction?: Transaction;

  public address = of("");
  public icon = "business";
  public confirmed = false;
  public multisig = false;
  public message = of("");

  public assets: Asset[] = [];
  public date = "";

  constructor(
    private store: Store<State>,
    private snackBar: MatSnackBar,
    private auth: AngularFireAuth,
    private language: LanguageService
  ) {
  }

  ngOnInit() {
    this.load();
  }

  private load() {
    if (!this.transaction) {
      return;
    }

    switch (this.transaction.type) {
      case TransactionTypes.MULTISIG: {
        this._transaction = (this.transaction as MultisigTransaction).otherTransaction;
        this.multisig = true;
        break;
      }

      default: {
        this._transaction = this.transaction;
        break;
      }
    }

    const accountHttp = new AccountHttp(nodes);

    this.address = of(this._transaction.signer!.address.pretty());
    this.date = `${this._transaction.timeWindow.timeStamp.toLocalDate()} ${this._transaction.timeWindow.timeStamp.toLocalTime()}`;

    switch (this._transaction.type) {
      case TransactionTypes.TRANSFER: {
        const transferTransaction = this._transaction as TransferTransaction;

        const observable = this.store.select(state => state.wallet).pipe(
          mergeMap(
            (wallet) => {
              const _wallet = wallet.entities[wallet.currentWallet!].wallet;
              if (!_wallet) {
                return of();
              }
              const password = new Password(this.auth.auth.currentUser!.uid);
              const account = SimpleWallet.readFromWLT(_wallet).open(password);

              return of(wallet).pipe(
                mergeMap(
                  (_) => {
                    return accountHttp.getFromAddress(transferTransaction.recipient);
                  }
                ),
                map(
                  (recipient) => {
                    if (transferTransaction.signer!.address.plain() == wallet.entities[wallet.currentWallet!].nem) {
                      this.icon = "call_made";
                      return {
                        address: recipient.publicAccount!.address.pretty(),
                        message: account.decryptMessage(transferTransaction.message, transferTransaction.signer!).payload
                      };
                    }

                    this.icon = "call_received";
                    return {
                      address: transferTransaction.signer!.address.pretty(),
                      message: account.decryptMessage(transferTransaction.message, recipient.publicAccount!).payload
                    }
                  }
                )
              );
            }
          )
        );

        this.address = observable.pipe(
          map(observable => observable.address)
        );

        this.message = observable.pipe(
          map(observable => observable.message)
        );

        if (transferTransaction.containsMosaics()) {
          this.assets = transferTransaction.mosaics();
        } else {
          this.assets = [new Asset(new AssetId("nem", "xem"), transferTransaction.xem().quantity)];
        }

        break;
      }
    }
  }
  
  public openSnackBar(type: string) {
    this.snackBar.open(this.translation.snackBar[type][this.lang], undefined, { duration: 3000 });
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
