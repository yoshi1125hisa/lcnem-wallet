import { Injectable } from '@angular/core';
import { Router, NavigationExtras, NavigationStart } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { WalletService } from '../wallet/wallet.service';
import { filter, first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(
    private router: Router,
    private auth: AuthService,
    private wallet: WalletService
  ) {
<<<<<<< HEAD
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
            case "/account/settings": {
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
          }
=======
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      map(event => event as NavigationStart)
    ).subscribe(
      async (event) => {
        if (event.url === "/account/login") {
          return
        }
        const user = await this.auth.user$.pipe(first()).toPromise()
        if (!user) {
          this.router.navigate(["account", "login"])
          return
        }

        if (event.url === "/account/wallets") {
          return
        }
        const state = await this.wallet.state$.pipe(
          filter(state => !state.loading),
          first()
        ).toPromise()

        if (!state.currentWalletId) {
          this.router.navigate(["account", "wallets"])
>>>>>>> 5e64869ff5e4a7c4f1205ae314c82059e06f36b0
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
