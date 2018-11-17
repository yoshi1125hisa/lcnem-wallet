import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
  AddWallet,
  WalletActionTypes,
  LoadWalletsFailed
  , LoadWalletsSuccess,
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


@Injectable()
export class WalletEffects {

  constructor(
    private actions$: Actions,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
  }

  @Effect() addWallet$ = this.actions$.pipe(
    ofType<AddWallet>(WalletActionTypes.AddWallet),
    mergeMap(action =>
      from(this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("wallets").add(action.payload)).pipe(
        map(data => new AddWalletSuccess()),
        catchError(() => of(new AddWalletFailed()))
      )
    )
  );

  @Effect() loadWallets$ = this.actions$.pipe(
    ofType<LoadWallets>(WalletActionTypes.LoadWallets),
    mergeMap(action =>
      from(this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("wallets").add(action.payload)).pipe(
        map(data => new LoadWalletsSuccess()),
        catchError(() => of(new LoadWalletsFailed()))
      )
    )
  );

  @Effect() updateWallet$ = this.actions$.pipe(
    ofType<UpdateWallet>(WalletActionTypes.UpdateWallet),
    mergeMap(action =>
      from(this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("wallets").add(action.payload)).pipe(
        map(data => new UpdateWalletSuccess()),
        catchError(() => of(new UpdateWalletFailed()))
      )
    )
  );

  @Effect() deleteWallet$ = this.actions$.pipe(
    ofType<DeleteWallet>(WalletActionTypes.DeleteWallet),
    mergeMap(action =>
      from(this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("wallets").add(action.payload)).pipe(
        map(data => new DeleteWalletSuccess()),
        catchError(() => of(new DeleteWalletFailed()))
      )
    )
  );

}
