import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, from } from 'rxjs';
import { Contact } from '../../../../../firebase/functions/src/models/contact';
import { RxEntityStateService } from '../../classes/rx-entity-state-service';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends RxEntityStateService<State, Contact> {
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
    this.load()

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

        this._subject$.next(state)
      },
      (error) => {
        this.error(error)
      }
    )
  }

  public addContact(userId: string, contact: Contact) {
    if(userId !== this._state.lastUserId) {
      throw Error()
    }
    this.load()

    from(this.firestore.collection("users").doc(userId).collection("contacts").add(contact)).subscribe(
      (document) => {
        const state: State = {
          ...this.addEntity(document.id, contact),
          loading: false
        }
        
        this._subject$.next(state)
      },
      (error) => {
        this.error(error)
      }
    )
  }

  public updateContact(userId: string, contactId: string, contact: Contact) {
    if(userId !== this._state.lastUserId) {
      throw Error()
    }
    this.load()

    from(this.firestore.collection("users").doc(userId).collection("contacts").doc(contactId).set(contact)).subscribe(
      () => {
        const state: State = {
          ...this.updateEntity(contactId, contact),
          loading: false
        }

        this._subject$.next(state)
      },
      (error) => {
        this.error(error)
      }
    )
  }

  public deleteContact(userId: string, contactId: string) {
    if(userId !== this._state.lastUserId) {
      throw Error()
    }
    this.load()

    from(this.firestore.collection("users").doc(userId).collection("contacts").doc(contactId).delete()).subscribe(
      () => {
        const state: State = {
          ...this.deleteEntity(contactId),
          loading: false
        }

        this._subject$.next(state)
      },
      (error) => {
        this.error(error)
      }
    )
  }
}

interface State {
  loading: boolean
  error?: Error
  ids: string[]
  entities: { [id: string]: Contact }
  lastUserId?: string
}
