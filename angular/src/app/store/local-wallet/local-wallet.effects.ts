import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  LoadLocalWallets,
  LocalWalletActionTypes,
  LoadLocalWalletsComplete,
  AddLocalWallet,
  AddLocalWalletSuccess,
  DeleteLocalWallet,
  DeleteLocalWalletSuccess,
  DeleteLocalWalletFailed,
  AddLocalWalletFailed
} from './local-wallet.actions';
import { mergeMap, catchError, map, merge } from 'rxjs/operators';
import { LoadBalancesFailed } from '../../nem/balance/balance.actions';
import { of, from } from 'rxjs';
import { AddContactFailed } from '../../contact/contact.actions';
import { Dictionary } from '@ngrx/entity';


@Injectable()
export class LocalWalletEffects {

  constructor(
    private actions$: Actions) {
  }

  private load() {
    const json = localStorage.getItem("wallets") || "";
    try {
      return JSON.parse(json) as Dictionary<string>;
    } catch {
      return {};
    }
  }

  private set(localWallets: Dictionary<string>) {
    localStorage.setItem("wallets", JSON.stringify(localWallets));
  }

  @Effect() loadLocalWallets$ = this.actions$.pipe(
    ofType<LoadLocalWallets>(LocalWalletActionTypes.LoadLocalWallets),
    mergeMap(
      (action) => {
        return of(this.load()).pipe(
          map(
            (data) => {
              return new LoadLocalWalletsComplete(
                {
                  localWallets: data
                }
              );
            }
          )
        );
      }
    )
  );

  @Effect() addLocalWallet$ = this.actions$.pipe(
    ofType<AddLocalWallet>(LocalWalletActionTypes.AddLocalWallet),
    mergeMap(
      (action) => {
        return of(this.load()).pipe(
          map(
            (data) => {
              const newData = { ...data };
              newData[action.payload.id] = action.payload.wallet;
              this.set(newData);
              return newData;
            }
          ),
          map(
            data => new AddLocalWalletSuccess(
              {
                localWallets: data
              }
            )
          ),
          catchError(e => of(new AddLocalWalletFailed(e)))
        );
      }
    )
  );

  @Effect() deleteLocalWallet$ = this.actions$.pipe(
    ofType<DeleteLocalWallet>(LocalWalletActionTypes.DeleteLocalWallet),
    mergeMap(
      (action) => {
        return of(this.load()).pipe(
          map(
            (data) => {
              const newData = { ...data };
              delete newData[action.payload.id];
              this.set(newData);
              return newData;
            }
          ),
          map(
            (data) => {
              return new DeleteLocalWalletSuccess(
                {
                  localWallets: data
                }
              );
            }
          ),
          catchError(
            (e) => {
              return of(new DeleteLocalWalletFailed(e));
            }
          )
        );
      }
    )
  );
}
