import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, from } from 'rxjs';
import { Contact } from '../../../../../firebase/functions/src/models/contact';
import { ReactiveService } from '../../classes/reactive-service';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends ReactiveService<State> {
  constructor(
    private firestore: AngularFirestore
  ) {
    super({
      loading: false,
      ids: [],
      contacts: {}
    })
  }

  public loadContacts(userId: string) {
    this._subject$.next({
      loading: true,
      error: undefined,
      ...this._state
    })

    this.firestore.collection("users").doc(userId).collection("contacts").get().subscribe(
      (collection) => {
        const state: State = {
          loading: false,
          ids: collection.docs.map(doc => doc.id),
          contacts: {}
        }
        for(const doc of collection.docs) {
          state.contacts[doc.id] = doc.data() as Contact
        }

        this._subject$.next(state)
      },
      (error) => {
        this._subject$.next({
          loading: false,
          error: error,
          ...this._state
        })
      }
    )
  }

  public addContact(userId: string, contact: Contact) {
    this._subject$.next({
      loading: true,
      error: undefined,
      ...this._state
    })

    from(this.firestore.collection("users").doc(userId).collection("contacts").add(contact)).subscribe(
      (document) => {
        const state: State = {
          loading: false,
          ...this._state
        }
        state.ids.push(document.id)
        state.contacts[document.id] = contact
      },
      (error) => {
        this._subject$.next({
          loading: false,
          error: error,
          ...this._state
        })
      }
    )
  }
}

interface State {
  loading: boolean
  error?: Error
  ids: string[]
  contacts: { [id: string]: Contact }
}
