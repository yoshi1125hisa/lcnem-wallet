import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, first, filter } from 'rxjs/operators';
import { Address } from 'nem-library';
import { LanguageService } from '../../../../services/language/language.service';
import { State as BalanceState } from '../../../../services/dlt/nem/balance/balance.reducer';
import { State as WalletState } from '../../../../services/user/wallet/wallet.reducer';
import { State as RateState } from '../../../../services/rate/rate.reducer';
import { Store } from '@ngrx/store';
import { LoadBalances } from '../../../../services/dlt/nem/balance/balance.actions';
import { ChangeCurrency } from '../../../../services/rate/rate.actions';

@Component({
  selector: 'app-nem-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  public get lang() { return this.language.code }

  public loading$ = combineLatest(
    this.wallet$,
    this.balance$
  ).pipe(
    map(([wallet, balance]) => wallet.loading || balance.loading)
  )

  public state$ = this.balance$
  public quoteCurrency$ = this.rate$.pipe(map(state => state.currency))

  constructor(
    private language: LanguageService,
    private wallet$: Store<WalletState>,
    private balance$: Store<BalanceState>,
    private rate$: Store<RateState>
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
    this.balance$.dispatch(new LoadBalances({ address, refresh }))
  }

  public changeCurrency(currency: string) {
    this.rate$.dispatch(new ChangeCurrency({ currency }))
  }

  public translation = {
    balance: {
      en: "Balance",
      ja: "残高"
    } as any
  }
}
