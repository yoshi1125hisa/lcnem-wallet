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
        map(data => new LoadUserSuccess({ user: data.ref.get })),
        catchError(e => of(new LoadUserFailed(e)))
      )
    )
  )
}
