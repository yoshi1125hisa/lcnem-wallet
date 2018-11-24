import { Component, Inject } from '@angular/core';
import { lang } from '../../../models/lang'
import { ContactsService } from '../../../services/contacts.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Contact } from '../../../../../../firebase/functions/src/models/contact';
import { Invoice } from '../../../models/invoice';
import { Router } from '@angular/router';
import { ContactEditDialogComponent } from '../contact-edit-dialog/contact-edit-dialog.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../store/index'

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.css']
})
export class ContactDialogComponent {
  public loading$: Observable<boolean>;
  get lang() { return lang; }

  public id: string;
  public _contact: Contact;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: {
      id: string
    },
    private store: Store<State>,
    private router: Router,
    private dialog: MatDialog,
    private contact: ContactsService
  ) {
    this.loading$ = store.select(state => state.contact.loading)
    this.id = data.id;
    this._contact = this.contact.contacts![data.id];
  }

  public async updateContact() {
    let result: Contact = await this.dialog.open(ContactEditDialogComponent, {
      data: {
        contact: this._contact
      }
    }).afterClosed().toPromise();

    if (!result) {
      return;
    }

    await this.contact.updateContact(this.id, result);
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
    memo: {
      en: "Memo",
      ja: "メモ"
    } as any
  }
}
