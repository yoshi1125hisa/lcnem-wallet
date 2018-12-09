import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { WalletService } from './services/wallet/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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

}
