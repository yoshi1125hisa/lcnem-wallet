import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';
import { Contact } from '../../../../../firebase/functions/src/models/contact';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private subject = new Subject<State>()
  private state: State = {
    loading: false,
    ids: [],
    contacts: {}
  }
  public state$ = this.subject.asObservable();

  constructor(
    private firestore: AngularFirestore
  ) {
    this.subject.next(this.state)
    this.state$.subscribe(
      (state) => {
        this.state = state
      }
    )
  }

  public loadContacts(userId: string) {
    this.subject.next({
      loading: true,
      error: undefined,
      ...this.state
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

        this.subject.next(state)
      },
      (error) => {
        this.subject.next({
          loading: false,
          error: error,
          ...this.state
        })
      }
    )
  }

  public addContact(userId: string, contact: Contact) {
    this.subject.next({
      loading: true,
      error: undefined,
      ...this.state
    })

    from(this.firestore.collection("users").doc(userId).collection("contacts").add(contact)).subscribe(
      (document) => {
        const state: State = {
          loading: false,
          ...this.state
        }
        state.ids.push(document.id)
        state.contacts[document.id] = contact
      },
      (error) => {
        this.subject.next({
          loading: false,
          error: error,
          ...this.state
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
