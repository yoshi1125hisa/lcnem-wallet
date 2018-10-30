import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Contact } from '../../../../../firebase/functions/src/models/contact';
import { ContactsService } from '../../services/contacts.service';
import { back } from '../../../models/back';
import { lang } from '../../../models/lang';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { Invoice } from '../../../models/invoice';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  public loading = true;
  get lang() { return lang; }
  public contacts!: {
    [id: string]: Contact
  };
  public contactIds: string[] = [];

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

  public async refresh(force?: boolean) {
    this.loading = true;
    await this.contact.readContacts(force);

    this.contacts = this.contact.contacts!;
    this.contactIds = Object.keys(this.contact.contacts!);

    this.loading = false;
  }

  public back() {
    back(() => this.router.navigate([""]));
  }

  public async createContact() {
    let result = await this.dialog.open(ContactDialogComponent, {
      data: {
        contact: {}
      }
    }).afterClosed().toPromise();

    if(!result) {
      return;
    }

    await this.contact.createContact(result);
  }

  public async editContact(id: string) {
    let result = await this.dialog.open(ContactDialogComponent, {
      data: {
        contact: this.contacts[id]
      }
    }).afterClosed().toPromise();

    if(!result) {
      return;
    }

    await this.contact.updateContact(id, result);
  }

  public async deleteContact(id: string) {
    let result = await this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translation.confirm[this.lang]
      }
    }).afterClosed().toPromise();

    if(!result) {
      return;
    }

    await this.contact.deleteContact(id);
  }

  public sendNem(nem: string) {
    let invoice = new Invoice();
    invoice.data.addr = nem;

    this.router.navigate(
      ["transactions", "transfer"],
      {
        queryParams: {
          invoice: encodeURI(invoice.stringify())
        }
      }
    );
  }

  public translation = {
    contacts: {
      en: "Contact list",
      ja: "コンタクトリスト"
    } as any,
    empty: {
      en: "There is no contacts.",
      ja: "コンタクトはありません。"
    } as any,
    confirm: {
      en: "Are you sure?",
      ja: "削除しますか？"
    } as any
  };
}
