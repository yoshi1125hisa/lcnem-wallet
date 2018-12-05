import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationExtras } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { WalletService } from '../wallet/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private wallet: WalletService
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        switch (event.url) {
          case "/account/login": {
            break;
          }

          case "/account/wallets": {
            if (!this.auth.auth.currentUser) {
              this.router.navigate(["account", "login"]);
              return;
            }
            break;
          }

          default: {
            if(!this.wallet.state.currentWalletId) {
              this.router.navigate(["account", "wallets"]);
            }
            break;
          }
        }
      }
    });
  }

  public back(commands: any[], extras?: NavigationExtras) {
    if(history.length > 1) {
      history.back()
    }
    this.router.navigate(commands, extras)
  }
}
