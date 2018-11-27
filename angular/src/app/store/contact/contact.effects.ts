import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { of, from, forkJoin } from 'rxjs';
import {
  ContactActionTypes,
  AddContact,
  AddContactFailed,
  AddContactSuccess,
  LoadContactsFailed,
  UpdateContactSuccess,
  UpdateContactFailed,
  LoadContacts,
  UpdateContact,
  LoadContactsSuccess,
  DeleteContacts,
  DeleteContactsFailed,
  DeleteContactsSuccess
} from './contact.actions';
import { Dictionary } from '@ngrx/entity';
import { Contact } from './contact.model';


@Injectable()
export class ContactEffects {

  constructor(
    private actions$: Actions,
    private firestore: AngularFirestore
  ) {
  }

  @Effect() loadContacts$ = this.actions$.pipe(
    ofType<LoadContacts>(ContactActionTypes.LoadContacts),
    mergeMap(
      (action) => {
        return this.firestore.collection("users").doc(action.payload.userId).collection("contacts").get().pipe(
          map(
            (data) => {
              const contacts: Dictionary<Contact> = {};
              for (let doc of data.docs) {
                contacts[doc.id] = doc.data() as Contact;
              }
              return contacts;
            }
          ),
          map(
            (data) => {
              return new LoadContactsSuccess({ contacts: data });
            }
          ),
          catchError(
            (e) => {
              return of(new LoadContactsFailed(e));
            }
          )
        );
      }
    )
  );

  @Effect() addContact$ = this.actions$.pipe(
    ofType<AddContact>(ContactActionTypes.AddContact),
    mergeMap(
      (action) => {
        return from(
          this.firestore.collection("users").doc(action.payload.userId).collection("contacts").add(action.payload.contact)
        ).pipe(
          map(
            (data) => {
              return new AddContactSuccess(
                {
                  id: data.id,
                  contact: action.payload.contact
                }
              );
            }
          ),
          catchError(
            (e) => {
              return of(new AddContactFailed(e));
            }
          )
        )
      }
    )
  );

  @Effect() updateContact$ = this.actions$.pipe(
    ofType<UpdateContact>(ContactActionTypes.UpdateContact),
    mergeMap(
      action => from(
        this.firestore.collection("users").doc(action.payload.userId).collection("contacts").doc(action.payload.id).set(action.payload.contact)
      ).pipe(
        map(
          data => new UpdateContactSuccess(
            {
              id: action.payload.id,
              contact: action.payload.contact
            }
          )
        ),
        catchError(e => of(new UpdateContactFailed(e)))
      )
    )
  );

  @Effect() deleteContacts$ = this.actions$.pipe(
    ofType<DeleteContacts>(ContactActionTypes.DeleteContacts),
    mergeMap(
      action => forkJoin(
        action.payload.ids.map(
          id => this.firestore.collection("users").doc(action.payload.userId).collection("contacts").doc(id).delete()
        )
      ).pipe(
        map(() => new DeleteContactsSuccess({ ids: action.payload.ids })),
        catchError(e => of(new DeleteContactsFailed(e)))
      )
    )
  );

}
