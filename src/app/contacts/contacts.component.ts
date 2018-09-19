import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../services/global-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Profile } from '../../models/profile';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  public loading = true;
  public contacts: Array<Profile> = [];

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

    for(let i = 0; i < collection.docs.length; i++) {
      let profileSnapshot = await this.global.firestore.collection("users").doc(collection.docs[i].id).ref.get();
      if(profileSnapshot.exists) {
        let profile = profileSnapshot.data() as any;
        profile.id = collection.docs[i].id;
        this.contacts.push(profile);
      }
    }

    this.loading = false;
  }

  public translation = {
    contacts: {
      en: "Contacts",
      ja: "アドレス帳"
    }
  } as { [key: string]: { [key: string]: string } };
}
