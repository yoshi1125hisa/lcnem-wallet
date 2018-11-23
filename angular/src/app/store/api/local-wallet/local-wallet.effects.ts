import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  LoadLocalWallets,
  LocalWalletActionTypes,
  LoadLocalWalletsSuccess
} from './local-wallet.actions';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { LoadBalancesFailed } from '../../nem/balance/balance.actions';
import { of } from 'rxjs';


@Injectable()
export class LocalWalletEffects {

  constructor(
    private actions$: Actions) {
  }

  @Effect() loadLocalWallets$ = this.actions$.pipe(
    ofType<LoadLocalWallets>(LocalWalletActionTypes.LoadLocalWallets),
    mergeMap(
      action => (JSON.parse(action.payload.localStorage.getItem("wallets")!)).pipe(
        map(data => new LoadLocalWalletsSuccess({ localWallets: data })),
        catchError(e => of(new LoadBalancesFailed(e)))
      )
    )
  )

}
