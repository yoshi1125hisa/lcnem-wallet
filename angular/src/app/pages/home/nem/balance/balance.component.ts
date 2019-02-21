import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, first, filter } from 'rxjs/operators';
import { Address } from 'nem-library';
import { LanguageService } from '../../../../services/language/language.service';
import { Store } from '@ngrx/store';
import { LoadBalances } from '../../../../services/dlt/nem/balance/balance.actions';
import { ChangeCurrency } from '../../../../services/rate/rate.actions';
import { State } from '../../../../services/reducer';

@Component({
  selector: 'app-nem-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  public get lang() { return this.language.code; }

  constructor(
    private language: LanguageService,
    private store: Store<State>
  ) {
  }

  public wallet$ = this.store.select(state => state.wallet);
  public balance$ = this.store.select(state => state.balance);
  public rate$ = this.store.select(state => state.rate);

  public loading$ = combineLatest(
    this.wallet$,
    this.balance$
  ).pipe(
    map(([wallet, balance]) => wallet.loading || balance.loading)
  );

  public quoteCurrency$ = this.rate$.pipe(map(state => state.currency));

  public translation = {
    balance: {
      en: 'Balance',
      ja: '残高'
    } as any
  };

  ngOnInit() {
    this.load();
  }

  public async load(refresh?: boolean) {
    const state = await this.wallet$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise();

    const address = new Address(state.entities[state.currentWalletId!].nem);
    this.store.dispatch(new LoadBalances({ address, refresh }));
  }

  public changeCurrency(currency: string) {
    this.store.dispatch(new ChangeCurrency({ currency }));
  }
}
