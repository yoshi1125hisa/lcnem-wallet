import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Contact } from '../../../../../firebase/functions/src/models/contact';
import { ContactsService } from '../../services/contacts.service';
import { back } from '../../../models/back';
import { lang } from '../../../models/lang';
import { UserService } from '../../services/user.service';

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
    private user: UserService,
    private contact: ContactsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.user.checkLogin().then(async () => {
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
