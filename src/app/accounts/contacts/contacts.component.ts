import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../services/global-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { User } from '../../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  public loading = true;
  public contacts: Array<User> = [];

  constructor(
    public global: GlobalDataService,
    private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.auth.authState.subscribe(async (user) => {
      if (user == null) {
        this.router.navigate(["/accounts/login"]);
        return;
      }
      await this.global.initialize();
      await this.refresh();
    });
  }

  public async refresh() {
    this.loading = true;

    this.contacts = [];

    let collection = await this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("contacts").ref.get();

    for (let i = 0; i < collection.docs.length; i++) {
      let userSnapshot = await this.firestore.collection("users").doc(collection.docs[i].id).ref.get();
      if (userSnapshot.exists) {
        let user = userSnapshot.data() as User;
        this.contacts.push(user);
      }
    }

    this.loading = false;
  }

  public translation = {
    contacts: {
      en: "Contacts book",
      ja: "アドレス帳"
    } as any,
    empty: {
      en: "There is no contacts.",
      ja: "コンタクトはありません。"
    } as any
  };
}
