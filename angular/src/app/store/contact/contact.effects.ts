import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';


@Injectable()
export class ContactEffects {

  constructor(
    private actions$: Actions,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
  }

  @Effect() addContact$ = this.actions$.pipe(
    ofType('ADD_CONTACT'),
    mergeMap(
      action => from(this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("contacts").add(action.payload.data)).pipe(
        map(data => ({ type: 'ADD_CONTACT_SUCCESS', payload: data })),
        catchError(() => of({ type: 'ADD_CONTACT_FAILED' }))
      )
    )
  );

  @Effect() loadContacts$ = this.actions$.pipe(
    ofType('LOAD_CONTACTS'),
    mergeMap(
      action => this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("contacts").get().pipe(
        map(data => ({ type: 'LOAD_CONTACTS_SUCCESS', payload: data })),
        catchError(() => of({ type: 'LOAD_CONTACTS_FAILED' }))
      )
    )
  );

  @Effect() updateContact$ = this.actions$.pipe(
    ofType('UPDATE_CONTACT'),
    mergeMap(
      action => from(this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("contacts").doc(action.payload.id).set(action.payload.data)).pipe(
        map(data => ({ type: 'UPDATE_CONTACT_SUCCESS', payload: data })),
        catchError(() => of({ type: 'UPDATE_CONTACT_FAILED' }))
      )
    )
  );

  @Effect() deleteContact$ = this.actions$.pipe(
    ofType('DELETE_CONTACT'),
    mergeMap(
      action => from(this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("contacts").doc(action.payload.id).delete()).pipe(
        map(data => ({ type: 'DELETE_CONTACT_SUCCESS', payload: data })),
        catchError(() => of({ type: 'DELETE_CONTACT_FAILED' }))
      )
    )
  );

}
