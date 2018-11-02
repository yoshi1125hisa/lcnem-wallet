import { Component, Inject } from '@angular/core';
import { lang } from '../../../../models/lang'
import { ContactsService } from '../../../services/contacts.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Contact } from '../../../../../../firebase/functions/src/models/contact';
import { Invoice } from '../../../../models/invoice';
import { Router } from '@angular/router';
import { ContactEditDialogComponent } from '../contact-edit-dialog/contact-edit-dialog.component';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.css']
})
export class ContactDialogComponent {
  get lang() { return lang; }

  public _contact: Contact;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: {
      contact: Contact
    },
    private router: Router,
    private dialog: MatDialog,
    private contact: ContactsService
  ) {
    this._contact = data.contact;
  }

  public async updateContact(contact: Contact) {
    let result: Contact = await this.dialog.open(ContactEditDialogComponent, {
      data: {
        contact: contact
      }
    }).afterClosed().toPromise();

    if(!result) {
      return;
    }

    await this.contact.createContact(result);
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
