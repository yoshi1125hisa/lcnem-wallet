import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserActionTypes, LoginGoogle, LoginGoogleFailed, LoginGoogleSuccess, LoadUser, LoadUserFailed, LoadUserSuccess } from './user.actions';
import { mergeMap, map, catchError, first } from 'rxjs/operators';
import { from, of } from 'rxjs';

import * as firebase from 'firebase/app';
import 'firebase/auth';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private auth: AngularFireAuth
  ) { }

  @Effect() loginGoogle$ = this.actions$.pipe(
    ofType<LoginGoogle>(UserActionTypes.LoginGoogle),
    mergeMap(
      action => from(this.auth.auth.signInWithPopup(new firebase.auth!.GoogleAuthProvider)).pipe(
        map(credential => new LoginGoogleSuccess({ credential: credential })),
        catchError(e => of(new LoginGoogleFailed(e)))
      )
    )
  )

  @Effect() loadUser$ = this.actions$.pipe(
    ofType<LoadUser>(UserActionTypes.LoadUser),
    mergeMap(
      action => from(this.auth.authState.pipe(first())).pipe(
        map(credential => new LoadUserSuccess({ credential: credential })),
        catchError(e => of(new LoadUserFailed(e)))
      )
    )
  )
}
