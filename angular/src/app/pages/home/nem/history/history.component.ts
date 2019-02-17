import { Component, OnInit, ViewChild } from '@angular/core';
import { Address } from 'nem-library';
import { combineLatest } from 'rxjs';
import { first, map, filter } from 'rxjs/operators';
import { LanguageService } from '../../../../services/language/language.service';
import { Store } from '@ngrx/store';
import { LoadHistories } from '../../../../services/dlt/nem/history/history.actions';
import { State } from '../../../../services/reducer';

@Component({
  selector: 'app-nem-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public get lang() { return this.language.code }

  public wallet$ = this.store.select(state => state.wallet)
  public history$ = this.store.select(state => state.history)
  public state$ = this.history$

  public loading$ = combineLatest(
    this.wallet$,
    this.history$
  ).pipe(
    map(([wallet, history]) => wallet.loading || history.loading)
  )

  constructor(
    private language: LanguageService,
    private store: Store<State>
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
    this.store.dispatch(new LoadHistories({ address, refresh }))
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
