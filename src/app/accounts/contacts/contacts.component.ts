import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../services/global-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { User } from '../../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Contact } from '../../../models/contact';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  public loading = true;
  public contacts: Contact[] = [];

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
        this.router.navigate(["accounts", "login"]);
        return;
      }
      await this.refresh();
    });
  }

  public async refresh() {
    this.loading = true;

    await this.global.checkRefresh();

    let contacts = await this.firestore.collection("users").doc(this.auth.auth.currentUser!.uid).collection("contacts").ref.get();

    this.contacts = contacts.docs.map(doc => doc.data() as Contact);

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
