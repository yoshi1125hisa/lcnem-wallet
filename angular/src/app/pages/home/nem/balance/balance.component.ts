import { Component, OnInit } from '@angular/core';
import { merge, combineLatest } from 'rxjs';
import { map, first, filter } from 'rxjs/operators';
import { Asset, Address } from 'nem-library';
import { LanguageService } from '../../../../services/language/language.service';
import { BalanceService } from '../../../../services/dlt/nem/balance/balance.service';
import { WalletService } from '../../../../services/wallet/wallet.service';
import { RateService } from '../../../../services/rate/rate.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter }

  public loading$ = combineLatest(
    this.wallet.state$,
    this.balance.state$
  ).pipe(
    map(([wallet, balance]) => wallet.loading || balance.loading)
  )

  public state$ = this.balance.state$
  public quoteCurrency$ = this.rate.state$.pipe(map(state => state.currency))

  constructor(
    private language: LanguageService,
    private wallet: WalletService,
    private balance: BalanceService,
    private rate: RateService
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
        this.balance.loadBalance(address, refresh)
      }
    )
  }

  public changeCurrency(currency: string) {
    this.rate.changeCurrency(currency)
  }

  public translation = {
    balance: {
      en: "Balance",
      ja: "残高"
    } as any
  }
}
