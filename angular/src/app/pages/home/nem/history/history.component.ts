import { Component, OnInit, ViewChild } from '@angular/core';
import { Address } from 'nem-library';
import { combineLatest } from 'rxjs';
import { first, map, filter } from 'rxjs/operators';
import { LanguageService } from '../../../../services/language/language.service';
import { WalletService } from '../../../../services/user/wallet/wallet.service';
import { HistoryService } from '../../../../services/dlt/nem/history/history.service';

@Component({
  selector: 'app-nem-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter }

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
    this.load()
  }

  public async load(refresh?: boolean) {
    const state = await this.wallet.state$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise()

    const address = new Address(state.entities[state.currentWalletId!].nem)
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
