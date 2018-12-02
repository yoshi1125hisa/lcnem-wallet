import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction, TransactionTypes, MultisigTransaction, TransferTransaction } from 'nem-library';
import { MatTableDataSource, MatPaginator, PageEvent, MatSnackBar, MatDialog } from '@angular/material';
import { TransactionComponent } from './transaction/transaction.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../store/index';
import { LanguageService } from '../../services/language.service';
import { LoadHistorys } from 'src/app/store/nem/history/history.actions';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public get lang() { return this.language.twoLetter; }

  public loading$: Observable<boolean>;
  public transactions$: Observable<Transaction[]>;

  constructor(
    private store: Store<State>,
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

  public translation = {
    history: {
      en: "History",
      ja: "履歴"
    } as any,
    noTransaction: {
      en: "There is no transaction.",
      ja: "取引はありません。"
    } as any
  };
}
