import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AngularFireAuth } from '@angular/fire/auth';
import { Contact } from '../../../../../firebase/functions/src/models/contact';
import { ContactsService } from 'src/app/services/contacts.service';
import { back } from 'src/models/back';
import { lang } from 'src/models/lang';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  public loading = true;
  get lang() { return lang; }
  public contacts: Contact[] = [];

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private contact: ContactsService,
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

    this.loading = false;
  }

  public back() {
    back(() => this.router.navigate([""]));
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
