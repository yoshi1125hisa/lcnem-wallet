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

    let collection = await this.global.firestore.collection("users").doc(this.global.auth.auth.currentUser!.uid).collection("contacts").ref.get();
    collection.docs.forEach(doc => {

    })

    this.loading = false;
  }
}
