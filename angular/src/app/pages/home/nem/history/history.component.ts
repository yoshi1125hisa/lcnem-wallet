import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction, TransactionTypes, MultisigTransaction, TransferTransaction, Address } from 'nem-library';
import { Observable, forkJoin } from 'rxjs';
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

  public loading$ = forkJoin(
    this.wallet.state$.pipe(map(state => state.loading)),
    this.history.state$.pipe(map(state => state.loading))
  ).pipe(
    map(data => data[0] || data[1])
  )
  public transactions$ = this.history.state$.pipe(map(state => state.transactions))

  constructor(
    private language: LanguageService,
    private wallet: WalletService,
    private history: HistoryService
  ) {
  }

  ngOnInit() {
    this.load();
  }

  public load(refresh?: boolean) {
    this.wallet.state$.pipe(first()).subscribe(
      (state) => {
        const address = new Address(state.entities[state.currentWalletId!].nem)
        this.history.loadHistories(address, refresh)
      }
    )
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
