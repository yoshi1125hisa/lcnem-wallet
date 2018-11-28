import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Back, RouterActionTypes, Navigate, NavigateSuccess, NavigateFailed } from './router.actions';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { State } from '..';


@Injectable()
export class RouterEffects {
  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private store: Store<State>,
    private actions$: Actions
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        switch (event.url) {
          case "/accounts/login": {
            break;
          }

          case "/accounts/wallets": {
            if (!this.auth.auth.currentUser) {
              this.router.navigate(["accounts", "login"]);
              return;
            }
            break;
          }

          default: {
            let wait = true;
            this.store.select(state => state.wallet.currentWallet).subscribe(currentWallet => {
              if (!currentWallet) {
                this.router.navigate(["accounts", "wallets"]);
              }
              wait = false;
            });
            while (wait);
          }
        }
      }
    });
  }

  @Effect() navigate$ = this.actions$.pipe(
    ofType<Navigate>(RouterActionTypes.Navigate),
    mergeMap(action =>
      from(this.router.navigate(action.payload.commands, action.payload.extras)).pipe(
        map(result => result ? new NavigateSuccess() : new NavigateFailed({ error: new Error() })),
        catchError(e => of(new NavigateFailed({ error: e })))
      )
    )
  );

  @Effect() back$ = this.actions$.pipe(
    ofType<Back>(RouterActionTypes.Back),
    mergeMap(action =>
      of(history.length).pipe(
        map(length => length > 1 ? history.back() : new Navigate(action.payload))
      )
    )
  )
}
