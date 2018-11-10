import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Contact } from '../../../../firebase/functions/src/models/contact';
import { WalletsService } from './wallets.service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  public contacts?: {
    [id: string]: Contact
  };

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private wallet: WalletsService
  ) {
    wallet.contact = this;
  }

  public initialize() {
    this.contacts = undefined;
  }

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
    if(this.contacts && !force) {
      return;
    }
    let uid = this.auth.auth.currentUser!.uid;
    let contacts = await this.firestore.collection("users").doc(uid).collection("contacts").get().toPromise();

    this.contacts = {};
    for(let doc of contacts.docs) {
      this.contacts[doc.id] = doc.data() as Contact;

      //nem: string[]からnem: { name: string, address: string}[]への互換性
      if(this.contacts[doc.id].nem && this.contacts[doc.id].nem.length && typeof this.contacts[doc.id].nem[0] == "string") {
        this.contacts[doc.id].nem = this.contacts[doc.id].nem.map(n => {
          return {
            name: "",
            address: n as any as string
          };
        });
      }
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
