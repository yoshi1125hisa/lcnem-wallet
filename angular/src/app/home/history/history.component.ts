import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction, TransactionTypes, MultisigTransaction, TransferTransaction } from 'nem-library';
import { lang } from '../../../models/lang';
import { HistoryService } from '../../services/history.service';
import { MatTableDataSource, MatPaginator, PageEvent, MatSnackBar, MatDialog } from '@angular/material';
import { TransactionComponent } from './transaction/transaction.component';
import { WalletsService } from '../../services/wallets.service';

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
    type: string,
    from: string,
    to: string,
    date: string,
    action: boolean,
    transaction: Transaction
  }>();
  public displayedColumns = ["confirmed", "type", "from", "to", "date", "action"];
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
        type: "",
        from: transaction.signer && transaction.signer.address.plain() || "",
        to: "",
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
      if(data.transaction.type == TransactionTypes.TRANSFER) {
        data.to = (data.transaction as TransferTransaction).recipient.plain();
        data.type = this.translation.transactionTypes.transfer[this.lang];
        data.action = true
      } else if(data.transaction.type == TransactionTypes.MULTISIG) {
        const multisigTransaction = data.transaction as MultisigTransaction;
        const otherTransaction = multisigTransaction.otherTransaction;
        data.from = otherTransaction.signer && otherTransaction.signer.address.plain() || "";

        if(otherTransaction.type == TransactionTypes.TRANSFER) {
          data.to = (otherTransaction as TransferTransaction).recipient.plain();
          data.type = this.translation.transactionTypes.multisig[this.lang];
          data.action = true
        } else {
          data.type = this.translation.transactionTypes.othersMultisig[this.lang];
        }
      } else {
        data.type = this.translation.transactionTypes.others[this.lang];
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
    if(type == "confirmed") {
      this.snackBar.open(this.translation.confirmedSnackBar[this.lang], undefined, { duration: 3000 });
    } else if (type == "unconfirmed") {
      this.snackBar.open(this.translation.unconfirmedSnackBar[this.lang], undefined, { duration: 3000 });
    }
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
    confirmedSnackBar: {
      en: "This transaction has been confirmed.",
      ja: "この取引はブロックチェーンに承認されています。"
    } as any,
    unconfirmedSnackBar: {
      en: "This transaction is not confirmed yet.",
      ja: "この取引はまだブロックチェーンに承認されていません。"
    } as any,
    transactionTypes: {
      transfer: {
        en: "Asset transfer",
        ja: "アセット送信"
      } as any,
      others: {
        en: "Others",
        ja: "その他"
      } as any,
      multisig: {
        en: "Asset transer(Multisig)",
        ja: "アセット送信(マルチシグ)"
      } as any,
      othersMultisig: {
        en: "Others(Multisig)",
        ja: "その他(マルチシグ)"
      } as any
    },
    confirmed: {
      en: "Confirmation",
      ja: "承認"
    } as any,
    type: {
      en: "Type",
      ja: "種類"
    } as any,
    from: {
      en: "From",
      ja: "送信者"
    } as any,
    to: {
      en: "To",
      ja: "受信者"
    } as any,
    date: {
      en: "Date",
      ja: "日時"
    } as any
  };
}
