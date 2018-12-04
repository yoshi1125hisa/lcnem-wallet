import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction, TransactionTypes, MultisigTransaction, TransferTransaction, Address } from 'nem-library';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { LanguageService } from '../../../../services/language/language.service';
import { WalletService } from '../../../../services/wallet/wallet.service';
import { HistoryService } from '../../../../services/nem/history/history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter; }

  public loading$: Observable<boolean>;
  public transactions$: Observable<Transaction[]>;

  constructor(
    private language: LanguageService,
    private wallet: WalletService,
    private history: HistoryService
  ) {
    this.loading$ = this.history.state$.pipe(map(state => state.loading))
    this.transactions$ = this.history.state$.pipe(map(state => state.transactions))
  }

  ngOnInit() {
    this.load();
  }

  public load(refresh?: boolean) {
    const address = new Address(this.wallet.state.entities[this.wallet.state.currentWalletId!].nem)
    this.history.loadHistories(address, refresh)
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
