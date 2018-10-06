import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../services/global-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { User } from '../../../models/user';

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
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.global.auth.authState.subscribe((user) => {
      if (user == null) {
        this.router.navigate(["/accounts/login"]);
        return;
      }
      this.global.initialize().then(() => {
        this.refresh();
      });
    });
  }

  public async refresh() {
    this.loading = true;

    this.contacts = [];

    let collection = await this.global.firestore.collection("users").doc(this.global.auth.auth.currentUser!.uid).collection("contacts").ref.get();

    for (let i = 0; i < collection.docs.length; i++) {
      let userSnapshot = await this.global.firestore.collection("users").doc(collection.docs[i].id).ref.get();
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
