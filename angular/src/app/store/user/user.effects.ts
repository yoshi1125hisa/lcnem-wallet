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
  CheckWallets,
  CheckLogin
} from './user.actions';
import { mergeMap, map, catchError, first } from 'rxjs/operators';
import { from, of } from 'rxjs';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { State } from '..';
import { Navigate } from '../router/router.actions';

@Injectable()
export class UserEffects {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<State>,
    private actions$: Actions
  ) { }

  @Effect() checkLogin$ = this.actions$.pipe(
    ofType<CheckLogin>(UserActionTypes.CheckLogin),
    mergeMap(
      action => this.auth.authState.pipe(
        map(authState => authState ? null : new Navigate({ commands: ["accounts", "login"] }))
      )
    )
  );

  @Effect() checkWallets$ = this.actions$.pipe(
    ofType<CheckWallets>(UserActionTypes.CheckWallets),
    mergeMap(
      action => this.store.select(state => state.user.currentWallet).pipe(
        map(currentWallet => currentWallet ? null : new Navigate({ commands: ["accounts", "wallets"] }))
      )
    )
  );

  @Effect() loginGoogle$ = this.actions$.pipe(
    ofType<LoginGoogle>(UserActionTypes.LoginGoogle),
    mergeMap(
      action => from(this.auth.auth.signInWithPopup(new firebase.auth!.GoogleAuthProvider)).pipe(
        map(credential => new LoginGoogleSuccess({ credential: credential })),
        catchError(e => of(new LoginGoogleFailed(e)))
      )
    )
  );

  @Effect() loadUser$ = this.actions$.pipe(
    ofType<LoadUser>(UserActionTypes.LoadUser),
    mergeMap(
      action => from(this.firestore.collection("users").doc(action.payload.userId).ref.get()).pipe(
        map(data => new LoadUserSuccess({ user: data.ref.get })),
        catchError(e => of(new LoadUserFailed(e)))
      )
    )
  )
}
