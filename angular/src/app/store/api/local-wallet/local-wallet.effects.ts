import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LoadLocalWallets, LocalWalletActionTypes, LoadLocalWalletsSuccess } from './local-wallet.actions';
import { mergeMap } from 'rxjs/operators';


@Injectable()
export class LocalWalletEffects {

  constructor(
    private actions$: Actions) {

  }

  @Effect() loadLocalWallets$ = this.actions$.pipe(
    ofType<LoadLocalWallets>(LocalWalletActionTypes.LoadLocalWallets),
    mergeMap(
      action => JSON.parse(this.action.payload.getItem("walltes"!)).pipe(
        map(data => new LoadLocalWalletsSuccess(data))
      )
    )
  )
}
