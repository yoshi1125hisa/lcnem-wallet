import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  public loading$: Observable<boolean>;
  public assets$: Observable<Asset[]>;

  constructor(
    private language: LanguageService,
    private wallet: WalletService,
    private balance: BalanceService
  ) {
    this.loading$ = this.balance.state$.pipe(map(state => state.loading))
    this.assets$ = this.balance.state$.pipe(map(state => state.assets))
  }

  ngOnInit() {
    this.load();
  }

  public load(refresh?: boolean) {
    const address = new Address(this.wallet.state.entities[this.wallet.state.currentWalletId!].nem)
    this.balance.loadBalance(address, refresh)
  }
}
