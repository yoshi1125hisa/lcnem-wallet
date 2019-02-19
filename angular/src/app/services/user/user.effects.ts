import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { UserActionTypes, UserActions, LoadUserSuccess, LoadUserError } from './user.actions';
import { map, mergeMap, catchError, first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../../../../firebase/functions/src/models/user';
import { State } from '../reducer';

@Injectable()
export class UserEffects {


  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType(UserActionTypes.LoadUser),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return this.user$.pipe(
          first(),
          mergeMap(
            (state) => {
              if (state.lastUserId && state.lastUserId === payload.userId && !payload.refresh) {
                return of(state.user!)
              }

              return this.firestore.collection("users").doc(payload.userId).get().pipe(
                map(doc => doc.data() as User)
              )
            }
          ),
          map(user => new LoadUserSuccess({ userId: payload.userId, user: user }))
        )
      }
    ),
    catchError(error => of(new LoadUserError({ error: error })))
  );

  public user$ = this.store.select(state => state.user)

  constructor(
    private actions$: Actions<UserActions>,
    private store: Store<State>,
    private firestore: AngularFirestore
  ) { }

}
