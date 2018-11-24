import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  UserActionTypes,
  LoginGoogle,
  LoginGoogleFailed,
  LoginGoogleSuccess,
  LoadUser,
  LoadUserFailed,
  LoadUserSuccess,
  Logout
} from './user.actions';
import { mergeMap, map, catchError, first } from 'rxjs/operators';
import { from, of } from 'rxjs';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../../../../../firebase/functions/src/models/user';
import { SimpleWallet } from 'nem-library';
import { Wallet } from '../wallet/wallet.model';

@Injectable()
export class UserEffects {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private actions$: Actions
  ) { }

  @Effect() loginGoogle$ = this.actions$.pipe(
    ofType<LoginGoogle>(UserActionTypes.LoginGoogle),
    mergeMap(
      action => from(this.auth.auth.signInWithPopup(new firebase.auth!.GoogleAuthProvider)).pipe(
        map(credential => new LoginGoogleSuccess({ credential: credential })),
        catchError(e => of(new LoginGoogleFailed(e)))
      )
    )
  );

  @Effect({ dispatch: false }) logout$ = this.actions$.pipe(
    ofType<Logout>(UserActionTypes.Logout),
    map(
      action => from(this.auth.auth.signOut()).pipe(
        map(() => location.reload())
      )
    )
  );

  @Effect() loadUser$ = this.actions$.pipe(
    ofType<LoadUser>(UserActionTypes.LoadUser),
    mergeMap(
      action => from(this.firestore.collection("users").doc(action.payload.userId).ref.get()).pipe(
        map(
          //レガシーコード
          data => {
            const userData = data.data() as any;
            if (userData.wallet) {
              let tempWallet = SimpleWallet.readFromWLT(userData.wallet);
              let wallet = {
                name: "1",
                local: false,
                nem: tempWallet.address.plain(),
                wallet: userData.wallet
              } as Wallet;

              let wait = true;
              data.ref.collection("wallets").add(wallet).then(
                () => {
                  data.ref.set({
                    name: this.auth.auth.currentUser!.displayName
                  } as User).then(
                    () => {
                      wait = false;
                    }
                  )
                }
              )
              while (wait);
            }

            return data;
          }
        ),
        map(data => new LoadUserSuccess({ user: data.ref.get })),
        catchError(e => of(new LoadUserFailed(e)))
      )
    )
  )
}
