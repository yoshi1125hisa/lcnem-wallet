import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { RxEntityStateStore, RxEntityState } from 'rx-state-store-js'
import { Contact } from '../../../../../firebase/functions/src/models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends RxEntityStateStore<State, Contact> {
  constructor(
    private firestore: AngularFirestore
  ) {
    super(
      {
        loading: false,
        ids: [],
        entities: {}
      }
    )
  }

  public loadContacts(userId: string, refresh?: boolean) {
    if(userId === this._state.lastUserId && !refresh) {
      return;
    }
    this.streamLoadingState()

    this.firestore.collection("users").doc(userId).collection("contacts").get().subscribe(
      (collection) => {
        const state: State = {
          loading: false,
          ids: collection.docs.map(doc => doc.id),
          entities: {},
          lastUserId: userId
        }
        for(const doc of collection.docs) {
          state.entities[doc.id] = doc.data() as Contact
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public addContact(userId: string, contact: Contact) {
    if(userId !== this._state.lastUserId) {
      throw Error()
    }
    this.streamLoadingState()

    from(this.firestore.collection("users").doc(userId).collection("contacts").add(contact)).subscribe(
      (document) => {
        const state: State = {
          ...this.getEntityAddedState(document.id, contact),
          loading: false
        }
        
        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public updateContact(userId: string, contactId: string, contact: Contact) {
    if(userId !== this._state.lastUserId) {
      throw Error()
    }
    this.streamLoadingState()

    from(this.firestore.collection("users").doc(userId).collection("contacts").doc(contactId).set(contact)).subscribe(
      () => {
        const state: State = {
          ...this.getEntityUpdatedState(contactId, contact),
          loading: false
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public deleteContact(userId: string, contactId: string) {
    if(userId !== this._state.lastUserId) {
      throw Error()
    }
    this.streamLoadingState()

    from(this.firestore.collection("users").doc(userId).collection("contacts").doc(contactId).delete()).subscribe(
      () => {
        const state: State = {
          ...this.getEntityDeletedState(contactId),
          loading: false
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }
}

interface State extends RxEntityState<Contact> {
  lastUserId?: string
}
