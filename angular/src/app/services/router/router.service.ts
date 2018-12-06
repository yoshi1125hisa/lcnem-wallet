import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { UserService } from '../user/user.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(
    private router: Router,
    private user: UserService,
    private wallet: WalletService
  ) {
    this.user.user$.subscribe(
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
