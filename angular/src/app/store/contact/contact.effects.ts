import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';
import {
  ContactActionTypes,
  AddContact,
  AddContactFailed,
  AddContactSuccess,
  LoadContactsFailed,
  DeleteContactFailed,
  UpdateContactSuccess,
  UpdateContactFailed,
  DeleteContact,
  LoadContacts,
  UpdateContact,
  LoadContactsSuccess,
  DeleteContactSuccess
} from './contact.actions';
import { Update } from '@ngrx/entity';


@Injectable()
export class ContactEffects {

  constructor(
    private actions$: Actions,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
  }

  @Effect() addContact$ = this.actions$.pipe(
    ofType<AddContact>(ContactActionTypes.AddContact),
    mergeMap(
      action => from(this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("contacts").add(action.payload)).pipe(
        map(data => new AddContactSuccess()),
        catchError(() => of(new AddContactFailed()))
      )
    )
  );

  @Effect() loadContacts$ = this.actions$.pipe(
    ofType<LoadContacts>(ContactActionTypes.LoadContacts),
    mergeMap(
      action => this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("contacts").get().pipe(
        map(data => new LoadContactsSuccess()),
        catchError(() => of(new LoadContactsFailed()))
      )
    )
  );

  @Effect() updateContact$ = this.actions$.pipe(
    ofType<UpdateContact>(ContactActionTypes.UpdateContact),
    mergeMap(
      action => from(this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("contacts").doc(action.payload.id).set(action.payload)).pipe(
        map(data => (new UpdateContactSuccess())),
        catchError(() => of(new UpdateContactFailed()))
      )
    )
  );

  @Effect() deleteContact$ = this.actions$.pipe(
    ofType<DeleteContact>(ContactActionTypes.DeleteContact),
    mergeMap(
      action => from(this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("contacts").doc(action.payload.id).delete()).pipe(
        map(data => (new DeleteContactSuccess())),
        catchError(() => of(new DeleteContactFailed()))
      )
    )
  );

}
