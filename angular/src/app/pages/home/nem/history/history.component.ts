import { Component, OnInit, ViewChild } from '@angular/core';
import { Address } from 'nem-library';
import { combineLatest } from 'rxjs';
import { first, map, filter } from 'rxjs/operators';
import { LanguageService } from '../../../../services/language/language.service';
import { State as WalletState } from '../../../../services/user/wallet/wallet.reducer';
import { State as HistoryState } from '../../../../services/dlt/nem/history/history.reducer';
import { Store } from '@ngrx/store';
import { LoadHistories } from '../../../../services/dlt/nem/history/history.actions';

@Component({
  selector: 'app-nem-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public get lang() { return this.language.code }

  public loading$ = combineLatest(
    this.wallet$,
    this.history$
  ).pipe(
    map(([wallet, history]) => wallet.loading || history.loading)
  )

  public state$ = this.history$

  constructor(
    private language: LanguageService,
    private wallet$: Store<WalletState>,
    private history$: Store<HistoryState>
  ) {
  }

  ngOnInit() {
    this.load()
  }

  public async load(refresh?: boolean) {
    const state = await this.wallet$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise()

    const address = new Address(state.entities[state.currentWalletId!].nem)
    this.history$.dispatch(new LoadHistories({ address, refresh }))
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
