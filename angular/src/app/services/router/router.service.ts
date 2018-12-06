import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationExtras } from '@angular/router';
import { UserService } from '../user/user.service';
import { WalletService } from '../wallet/wallet.service';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
          return
        }
        const subscription = this.wallet.state$.subscribe(
          (state) => {
            //まだウォレット読み込めてない場合
            if(state.lastUserId !== user.uid) {
              return
            }
            //読み込めたらメモリ解放
            subscription.unsubscribe()

            //読み込んで結果nullの場合
            if(!state.currentWalletId) {
              this.router.navigate(["account", "wallets"])
            }
          }
        )
        this.wallet.loadWallets(user.uid)
      }
    )

    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        switch (event.url) {
          case "/account/login": {
            break;
          }

          case "/account/wallets": {
            if (!this.user.user) {
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

  //途中
  public checkRouting() {
    const subject$ = new Subject()
    
    this.user.user$.pipe(first()).subscribe(
      (user) => {
        if(!user) {
          this.router.navigate(["account", "login"])
          subject$.complete()
          return
        }
      }
    )
    
    return subject$
  }

  public back(commands: any[], extras?: NavigationExtras) {
    if(history.length > 1) {
      history.back()
    }
    this.router.navigate(commands, extras)
  }
}
