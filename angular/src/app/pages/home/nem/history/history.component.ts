import { Component, OnInit, ViewChild } from '@angular/core';
import { Address } from 'nem-library';
import { combineLatest } from 'rxjs';
import { first, map, filter } from 'rxjs/operators';
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

  public loading$ = combineLatest(
    this.wallet.state$,
    this.history.state$
  ).pipe(
    map(([wallet, history]) => wallet.loading || history.loading)
  )

  public state$ = this.history.state$

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
    this.wallet.state$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).subscribe(
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
