import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { WalletActionTypes } from './wallet.actions';
import * as fromWallet from './wallet.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class WalletEffects {


  @Effect()
  loadWallets$ = this.actions$.pipe(
    ofType(WalletActionTypes.LoadWallets)
  );


  constructor(
    private actions$: Actions,
    private store: Store<fromWallet.State>
  ) {}

  
  private setLocalWallet(localWallets: { [id: string]: string }) {
    localStorage.setItem("wallets", JSON.stringify(localWallets))
  }

  private getLocalWallets(): { [id: string]: string } {
    const json = localStorage.getItem("wallets") || "";
    try {
      return JSON.parse(json)
    } catch {
      return {}
    }
  }

}
