import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFirestore } from '@angular/fire/firestore';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
  AddWallet,
  WalletActionTypes,
  LoadWalletsFailed,
  LoadWalletsSuccess,
  UpdateWalletFailed,
  UpdateWalletSuccess,
  UpdateWallet,
  DeleteWalletFailed,
  DeleteWalletSuccess,
  DeleteWallet,
  LoadWallets,
  AddWalletFailed,
  AddWalletSuccess
} from './wallet.actions';
import { Dictionary } from '@ngrx/entity';
import { Wallet } from './wallet.model';


@Injectable()
export class WalletEffects {

  constructor(
    private actions$: Actions,
    private firestore: AngularFirestore
  ) {
  }

  @Effect() loadWallets$ = this.actions$.pipe(
    ofType<LoadWallets>(WalletActionTypes.LoadWallets),
    mergeMap(action =>
      this.firestore.collection("users").doc(action.payload.userId).collection("wallets").get().pipe(
        map(
          data => {
            const wallets: Dictionary<Wallet> = {};
            for (let doc of data.docs) {
              wallets[doc.id] = doc.data() as Wallet;
            }
            return wallets;
          }
        ),
        map(data => new LoadWalletsSuccess({ wallets: data })),
        catchError(e => of(new LoadWalletsFailed(e)))
      )
    )
  );

  @Effect() addWallet$ = this.actions$.pipe(
    ofType<AddWallet>(WalletActionTypes.AddWallet),
    mergeMap(action =>
      from(
        this.firestore.collection("users").doc(action.payload.userId).collection("wallets").add(action.payload.wallet)
      ).pipe(
        map(
          data => new AddWalletSuccess(
            {
              id: data.id,
              wallet: action.payload.wallet
            }
          )),
        catchError(e => of(new AddWalletFailed(e)))
      )
    )
  );

  @Effect() updateWallet$ = this.actions$.pipe(
    ofType<UpdateWallet>(WalletActionTypes.UpdateWallet),
    mergeMap(action =>
      from(
        this.firestore.collection("users").doc(action.payload.userId).collection("wallets").doc(action.payload.id).set(action.payload.wallet)
      ).pipe(
        map(data => new UpdateWalletSuccess(
          {
            id: action.payload.id,
            wallet: action.payload.wallet
          }
        )),
        catchError(e => of(new UpdateWalletFailed(e)))
      )
    )
  );

  @Effect() deleteWallet$ = this.actions$.pipe(
    ofType<DeleteWallet>(WalletActionTypes.DeleteWallet),
    mergeMap(action =>
      from(
        this.firestore.collection("users").doc(action.payload.userId).collection("wallets").doc(action.payload.id).delete()
      ).pipe(
        map(data => new DeleteWalletSuccess({ id: action.payload.id })),
        catchError(e => of(new DeleteWalletFailed(e)))
      )
    )
  );

}
