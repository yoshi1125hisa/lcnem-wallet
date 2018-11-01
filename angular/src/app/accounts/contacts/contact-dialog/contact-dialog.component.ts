import { Component, OnInit, Inject } from '@angular/core';
import { lang } from '../../../../models/lang'
import { ContactsService } from '../../../services/contacts.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Contact } from '../../../../../../firebase/functions/src/models/contact';
import { Invoice } from 'src/models/invoice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.css']
})
export class ContactDialogComponent implements OnInit {
  get lang() { return lang; }

  public contact: Contact;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: {
      contact: Contact
    },
    private router: Router
  ) {
    this.contact = data.contact;
  }

  ngOnInit() {
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
