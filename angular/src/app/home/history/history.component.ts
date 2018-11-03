import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction, TransactionTypes, MultisigTransaction, TransferTransaction } from 'nem-library';
import { lang } from '../../../models/lang';
import { HistoryService } from '../../services/history.service';
import { MatTableDataSource, MatPaginator, PageEvent, MatSnackBar, MatDialog } from '@angular/material';
import { TransactionComponent } from './transaction/transaction.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public loading = true;
  get lang() { return lang; }

  public dataSource = new MatTableDataSource<{
    confirmed: boolean,
    icon: string,
    multisig?: boolean,
    address: string,
    date: string,
    action: boolean,
    transaction: Transaction
  }>();
  public displayedColumns = ["confirmed", "type", "address", "date", "action"];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public transactions?: Transaction[];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private history: HistoryService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  public async refresh(force?: boolean) {
    await this.history.readTransactions(force);

    this.dataSource.data = this.history.transactions!.map(transaction => {
      return {
        confirmed: transaction.isConfirmed(),
        icon: "",
        address: "",
        date: `${transaction.timeWindow.timeStamp.toLocalDate()} ${transaction.timeWindow.timeStamp.toLocalTime()}`,
        action: false,
        transaction: transaction
      }
    });

    this.dataSource.paginator = this.paginator;
    this.paginator.length = this.dataSource!.data.length;
    this.paginator.pageSize = 10;

    this.onPageChanged({
      length: this.paginator.length,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    });
  }

  public async onPageChanged(pageEvent: PageEvent) {
    this.loading = true;

    let dataSourceRange = this.dataSource.data.slice(pageEvent.pageIndex * pageEvent.pageSize, Math.min((pageEvent.pageIndex + 1) * pageEvent.pageSize, pageEvent.length));

    for (let data of dataSourceRange) {
      const setDataFromTransferTransaction = (transaction: TransferTransaction) => {
        data.address = transaction.recipient.plain();
        if(data.address == this.history.address.plain()) {
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
