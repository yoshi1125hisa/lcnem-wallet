import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { WalletActionTypes, WalletActions, LoadWalletsSuccess, LoadWalletsError, AddWalletSuccess, AddWalletError, UpdateWalletSuccess, UpdateWalletError, DeleteWalletSuccess, DeleteWalletError } from './wallet.actions';
import * as fromWallet from './wallet.reducer';
import { Store } from '@ngrx/store';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Wallet } from '../../../../../../firebase/functions/src/models/wallet';

@Injectable()
export class WalletEffects {


  @Effect()
  loadWallets$ = this.actions$.pipe(
    ofType(WalletActionTypes.LoadWallets),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return this.store.pipe(
          mergeMap(
            (state) => {
              if (state.lastUserId && state.lastUserId === payload.userId && !payload.refresh) {
                return of({ ids: state.ids, entities: state.entities })
              }

              return this.firestore.collection("users").doc(payload.userId).collection("wallets").get().pipe(
                map(
                  (collection) => {
                    const ids = collection.docs.map(doc => doc.id)
                    const entities: { [id: string]: Wallet } = {}
                    for (const doc of collection.docs) {
                      entities[doc.id] = doc.data() as Wallet

                    }

                    return { ids: ids, entities: entities }
                  }
                )
              )
            }
          )
        )
      }
    ),
    map(({ ids, entities }) => new LoadWalletsSuccess({ ids: ids, entities: entities, currentWalletId: "" })),
    catchError(error => of(new LoadWalletsError({ error: error })))
  );

  @Effect()
  addWallet$ = this.actions$.pipe(
    ofType(WalletActionTypes.AddWallet),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return from(this.firestore.collection("users").doc(payload.userId).collection("wallets").add(payload.wallet)).pipe(
          map(
            (doc) => {
              return { id: doc.id, wallet: payload.wallet }
            }
          )
        )
      }
    ),
    map(({ id, wallet }) => new AddWalletSuccess({ walletId: id, wallet: wallet })),
    catchError(error => of(new AddWalletError({ error: error })))
  )

  @Effect()
  updateWallet$ = this.actions$.pipe(
    ofType(WalletActionTypes.UpdateWallet),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return from(this.firestore.collection("users").doc(payload.userId).collection("wallets").doc(payload.walletId).set(payload.wallet)).pipe(
          map(_ => payload)
        )
      }
    ),
    map(payload => new UpdateWalletSuccess({ walletId: payload.walletId, wallet: payload.wallet })),
    catchError(error => of(new UpdateWalletError({ error: error })))
  )

  @Effect()
  deleteWallet$ = this.actions$.pipe(
    ofType(WalletActionTypes.DeleteWallet),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return from(this.firestore.collection("users").doc(payload.userId).collection("wallets").doc(payload.walletId).delete()).pipe(
          map(_ => payload)
        )
      }
    ),
    map(payload => new DeleteWalletSuccess({ walletId: payload.walletId })),
    catchError(error => of(new DeleteWalletError({ error: error })))
  )


  constructor(
    private actions$: Actions<WalletActions>,
    private store: Store<fromWallet.State>,
    private firestore: AngularFirestore
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
