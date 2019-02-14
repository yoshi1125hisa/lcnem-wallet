import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';



import { WalletActionTypes } from './wallet.actions';

@Injectable()
export class WalletEffects {


  @Effect()
  loadWallets$ = this.actions$.pipe(ofType(WalletActionTypes.LoadWallets));


  constructor(private actions$: Actions) {}

}
