import { Component, OnInit } from '@angular/core';
import { merge, combineLatest } from 'rxjs';
import { map, first, filter } from 'rxjs/operators';
import { Asset, Address } from 'nem-library';
import { LanguageService } from '../../../../services/language/language.service';
import { BalanceService } from '../../../../services/nem/balance/balance.service';
import { WalletService } from '../../../../services/wallet/wallet.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  public loading$ = combineLatest(
    this.wallet.state$,
    this.balance.state$
  ).pipe(
    map(fork => fork[0].loading || fork[1].loading)
  )

  public state$ = this.balance.state$

  constructor(
    private language: LanguageService,
    private wallet: WalletService,
    private balance: BalanceService
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

}
