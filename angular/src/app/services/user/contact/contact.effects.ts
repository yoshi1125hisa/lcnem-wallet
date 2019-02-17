import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ContactActionTypes, UpdateContactSuccess, LoadContactsSuccess, LoadContactsError, ContactActions, AddContactSuccess, AddContactError, UpdateContactError, DeleteContactSuccess, DeleteContactError } from './contact.actions';
import { Store } from '@ngrx/store';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Contact } from '../../../../../../firebase/functions/src/models/contact';
import { State } from '../../reducer';

@Injectable()
export class ContactEffects {

  @Effect()
  loadContacts$ = this.actions$.pipe(
    ofType(ContactActionTypes.LoadContacts),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return this.contact$.pipe(
          mergeMap(
            (state) => {
              if (state.lastUserId && state.lastUserId === payload.userId && !payload.refresh) {
                return of({ ids: state.ids, entities: state.entities })
              }

              return this.firestore.collection("users").doc(payload.userId).collection("contacts").get().pipe(
                map(
                  (collection) => {
                    const ids = collection.docs.map(doc => doc.id)
                    const entities: { [id: string]: Contact } = {}
                    for (const doc of collection.docs) {
                      entities[doc.id] = doc.data() as Contact

                      //レガシー
                      if (!entities[doc.id].nem[0] || !entities[doc.id].nem[0].address) {
                        entities[doc.id].nem = entities[doc.id].nem.map((nem: any) => { return { name: "", address: nem } })
                      }
                    }

                    return { ids: ids, entities: entities }
                  }
                )
              )
            }
          )
        )
      }
    ),
    map(({ ids, entities }) => new LoadContactsSuccess({ ids: ids, entities: entities })),
    catchError(error => of(new LoadContactsError({ error: error })))
  );

  @Effect()
  addContact$ = this.actions$.pipe(
    ofType(ContactActionTypes.AddContact),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return from(this.firestore.collection("users").doc(payload.userId).collection("contacts").add(payload.contact)).pipe(
          map(
            (doc) => {
              return { id: doc.id, contact: payload.contact }
            }
          )
        )
      }
    ),
    map(({ id, contact }) => new AddContactSuccess({ contactId: id, contact: contact })),
    catchError(error => of(new AddContactError({ error: error })))
  )

  @Effect()
  updateContact$ = this.actions$.pipe(
    ofType(ContactActionTypes.UpdateContact),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return from(this.firestore.collection("users").doc(payload.userId).collection("contacts").doc(payload.contactId).set(payload.contact)).pipe(
          map(_ => payload)
        )
      }
    ),
    map(payload => new UpdateContactSuccess({ contactId: payload.contactId, contact: payload.contact })),
    catchError(error => of(new UpdateContactError({ error: error })))
  )

  @Effect()
  deleteContact$ = this.actions$.pipe(
    ofType(ContactActionTypes.DeleteContact),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return from(this.firestore.collection("users").doc(payload.userId).collection("contacts").doc(payload.contactId).delete()).pipe(
          map(_ => payload)
        )
      }
    ),
    map(payload => new DeleteContactSuccess({ contactId: payload.contactId })),
    catchError(error => of(new DeleteContactError({ error: error })))
  )

  public contact$ = this.store.select(state => state.contact)

  constructor(
    private actions$: Actions<ContactActions>,
    private store: Store<State>,
    private firestore: AngularFirestore
  ) { }

}
