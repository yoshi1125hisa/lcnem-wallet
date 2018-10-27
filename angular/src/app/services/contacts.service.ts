import { Injectable } from '@angular/core';
import { Contact } from 'src/../../firebase/functions/src/models/contact';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  public contacts?: {
    [id: string]: Contact
  };

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  public async createContact(contact: Contact) {
    if(!this.contacts) {
      return;
    }
    let uid = this.auth.auth.currentUser!.uid;
    let newContact = await this.firestore.collection("users").doc(uid).collection("contacts").add(contact);
    this.contacts[newContact.id] = contact;

    return newContact.id;
  }

  public async readContacts(force?: boolean) {
    let uid = this.auth.auth.currentUser!.uid;
    let contacts = await this.firestore.collection("users").doc(uid).collection("contacts").get().toPromise();

    this.contacts = {};
    for(let doc of contacts.docs) {
      this.contacts[doc.id] = doc.data() as Contact;
    }
  }

  public async updateContact(id: string, data: any) {
    if(!this.contacts) {
      return;
    }

    let uid = this.auth.auth.currentUser!.uid;
    await this.firestore.collection("users").doc(uid).collection("contacts").doc(id).set(
      data,
      { merge: true }
    );

    for(let key in data) {
      (this.contacts[id] as any)[key] = data[key];
    }
  }

  public async deleteContact(id: string) {
    if(!this.contacts) {
      return;
    }
    let uid = this.auth.auth.currentUser!.uid;

    await this.firestore.collection("users").doc(uid).collection("contacts").doc(id).delete();

    delete this.contacts[id];
  }
}
