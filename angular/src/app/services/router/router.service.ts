import { Injectable } from '@angular/core';
import { Router, NavigationExtras, NavigationStart, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { filter, first, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '../reducer';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  public wallet$ = this.store.select(state => state.wallet)

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private store: Store<State>
  ) {
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
          this.router.navigate(["account", "login"], { queryParamsHandling: "preserve" })
          return
        }

        if (event.url === "/account/wallets") {
          return
        }
        const state = await this.wallet$.pipe(
          filter(state => !state.loading),
          first()
        ).toPromise()

        if (!state.currentWalletId) {
          this.router.navigate(["account", "wallets"], { queryParamsHandling: "preserve" })
        }

        if (this.route.snapshot.queryParams.clientToken) {
          this.router.navigate(["account", "integrate"], { queryParamsHandling: "preserve" })
          return
        }
      }
    )
  }

  public back(commands: any[], extras?: NavigationExtras) {
    if (history.length > 1) {
      history.back()
      return
    }
    this.router.navigate(commands, extras)
  }
}
