import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  LoadLocalWallets,
  LocalWalletActionTypes,
  LoadLocalWalletsSuccess,
  AddLocalWallet,
  AddLocalWalletSuccess,
  DeleteLocalWallet,
  DeleteLocalWalletSuccess,
  DeleteLocalWalletFailed
} from './local-wallet.actions';
import { mergeMap, catchError, map, merge } from 'rxjs/operators';
import { LoadBalancesFailed } from '../../nem/balance/balance.actions';
import { of, from } from 'rxjs';
import { AddContactFailed } from '../../contact/contact.actions';


@Injectable()
export class LocalWalletEffects {

  constructor(
    private actions$: Actions) {
  }

  @Effect() loadLocalWallets$ = this.actions$.pipe(
    ofType<LoadLocalWallets>(LocalWalletActionTypes.LoadLocalWallets),
    mergeMap(
      action => (JSON.parse(localStorage.getItem("wallets")!)).pipe(
        map(data => new LoadLocalWalletsSuccess({})),
        catchError(e => of(new LoadBalancesFailed(e)))
      )
    )
  )

  @Effect() addLocalWallet$ = this.actions$.pipe(
    ofType<AddLocalWallet>(LocalWalletActionTypes.AddLcalWallet),
    mergeMap(
      action => of(localStorage.setItem("wallets", JSON.stringify(action.payload.localWallets))).pipe(
        map(data => new AddLocalWalletSuccess({})),
        catchError(e => of(new AddContactFailed(e)))
      )
    )
  )

  @Effect() deleteLocalWallet$ = this.actions$.pipe(
    ofType<DeleteLocalWallet>(LocalWalletActionTypes.DeleteLocalWallet),
    mergeMap(
      action => of(localStorage.setItem("wallets", JSON.stringify(action.payload.localWallets))).pipe(
        map(data => new DeleteLocalWalletSuccess({})),
        catchError(e => of(new DeleteLocalWalletFailed(e)))
      )
    )
  )

}
