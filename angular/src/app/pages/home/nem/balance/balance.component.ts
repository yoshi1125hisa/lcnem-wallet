import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, first } from 'rxjs/operators';
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
  public loading$ = forkJoin(
    this.wallet.state$.pipe(map(state => state.loading)),
    this.balance.state$.pipe(map(state => state.loading))
  ).pipe(
    map(data => data[0] || data[1])
  )
  public assets$ = this.balance.state$.pipe(map(state => state.assets))

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
    this.wallet.state$.pipe(first()).subscribe(
      (state) => {
        const address = new Address(state.entities[state.currentWalletId!].nem)
        this.balance.loadBalance(address, refresh)
      }
    )
  }
}
