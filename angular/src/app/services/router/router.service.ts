import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { WalletService } from '../wallet/wallet.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(
    private router: Router,
    private auth: AuthService,
    private wallet: WalletService
  ) {
    this.auth.user$.subscribe(
      (user) => {
        if(!user) {
          this.router.navigate(["account", "login"])
        }
      }
    )

    this.wallet.state$.subscribe(
      (state) => {
        if(!state.loading && !state.currentWalletId) {
          this.router.navigate(["account", "wallets"])
        }
      }
    )
  }

  public back(commands: any[], extras?: NavigationExtras) {
    if(history.length > 1) {
      history.back()
    }
    this.router.navigate(commands, extras)
  }
}
