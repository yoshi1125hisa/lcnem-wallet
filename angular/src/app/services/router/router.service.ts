import { Injectable } from '@angular/core';
import { Router, NavigationExtras, NavigationStart } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { WalletService } from '../wallet/wallet.service';
import { filter, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(
    private router: Router,
    private auth: AuthService,
    private wallet: WalletService
  ) {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          switch (event.url) {
            case "/account/login": {
              break
            }
            case "/account/wallets": {
              this.auth.user$.pipe(
                first()
              ).subscribe(
                (user) => {
                  if (!user) {
                    this.router.navigate(["account", "login"])
                  }
                }
              )
              break
            }
            case "/":
            case "/nem/transfer": {
              this.wallet.state$.pipe(
                filter(state => !state.loading),
                first()
              ).subscribe(
                (state) => {
                  if (!state.currentWalletId) {
                    this.router.navigate(["account", "wallets"])
                  }
                }
              )
              break
            }
          }
        }
      }
    )
  }

  public back(commands: any[], extras?: NavigationExtras) {
    if (history.length > 1) {
      history.back()
    }
    this.router.navigate(commands, extras)
  }
}
