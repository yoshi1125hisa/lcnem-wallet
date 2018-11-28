import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction, TransactionTypes, MultisigTransaction, TransferTransaction } from 'nem-library';
import { MatTableDataSource, MatPaginator, PageEvent, MatSnackBar, MatDialog } from '@angular/material';
import { TransactionComponent } from './transaction/transaction.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../store/index';
import { LanguageService } from '../../services/language.service';
import { LoadHistorys } from 'src/app/store/nem/history/history.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public get lang() { return this.language.twoLetter; }

  public loading$: Observable<boolean>;
  public transactions$: Observable<Transaction[]>;

  public dataSource = this.transactions$.pipe(
    map(
      (transactions) => {
        const dataSource = new MatTableDataSource(
          transactions.map(
            (transaction) => {
              return {
                confirmed: transaction.isConfirmed(),
                icon: "",
                address: "",
                date: `${transaction.timeWindow.timeStamp.toLocalDate()} ${transaction.timeWindow.timeStamp.toLocalTime()}`,
                action: false,
                transaction: transaction
              };
            }
          )
        );
        dataSource.paginator = this.paginator;
        this.paginator.length = dataSource.data.length;
        return dataSource;
      }
    )
  );

  public readonly displayedColumns = ["confirmed", "type", "address", "date", "action"]
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private store: Store<State>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private language: LanguageService
  ) {
    this.loading$ = this.store.select(state => state.NemHistory.loading);
    this.transactions$ = this.store.select(state => state.NemHistory.transactions);
  }

  ngOnInit() {
    this.load();
  }

  public load(refresh?: boolean) {
    this.store.dispatch(
      new LoadHistorys()
    );
  }

  public onPageChanged(pageEvent: PageEvent) {
    this.loading = true;

    let dataSourceRange = this.dataSource.data.slice(pageEvent.pageIndex * pageEvent.pageSize, Math.min((pageEvent.pageIndex + 1) * pageEvent.pageSize, pageEvent.length));

    for (let data of dataSourceRange) {
      const setDataFromTransferTransaction = (transaction: TransferTransaction) => {
        data.address = transaction.recipient.plain();
        if (data.address == this.wallet.wallets![this.wallet.currentWallet!].nem) {
          data.icon = "call_received"
          data.address = transaction.signer && transaction.signer.address.plain() || "";
        } else {
          data.icon = "call_made"
        }
        data.action = true;
      }

      if (data.transaction.type == TransactionTypes.TRANSFER) {
        setDataFromTransferTransaction(data.transaction as TransferTransaction);
      } else if (data.transaction.type == TransactionTypes.MULTISIG) {
        const multisigTransaction = data.transaction as MultisigTransaction;
        const otherTransaction = multisigTransaction.otherTransaction;
        data.multisig = true;

        if (otherTransaction.type == TransactionTypes.TRANSFER) {
          setDataFromTransferTransaction(otherTransaction as TransferTransaction);
        } else {
          data.icon = "business";
        }
      } else {
        data.icon = "business";
      }
    }

    this.loading = false;
  }

  public openTransaction(transaction: Transaction) {
    this.dialog.open(TransactionComponent, {
      data: {
        transaction: transaction
      }
    });
  }

  public async openSnackBar(type: string) {
    this.snackBar.open(this.translation.snackBar[type][this.lang], undefined, { duration: 3000 });
  }

  public translation = {
    history: {
      en: "History",
      ja: "履歴"
    } as any,
    noTransaction: {
      en: "There is no transaction.",
      ja: "取引はありません。"
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
    confirmed: {
      en: "Confirmation",
      ja: "承認"
    } as any,
    type: {
      en: "Type",
      ja: "種類"
    } as any,
    address: {
      en: "Address",
      ja: "アドレス"
    } as any,
    date: {
      en: "Date",
      ja: "日時"
    } as any
  };
}
