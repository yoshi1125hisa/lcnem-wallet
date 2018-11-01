import { Component, OnInit, Inject } from '@angular/core';
import { lang } from '../../../../models/lang';
import { Contact } from '../../../../../../firebase/functions/src/models/contact';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-contact-edit-dialog',
  templateUrl: './contact-edit-dialog.component.html',
  styleUrls: ['./contact-edit-dialog.component.css']
})
export class ContactEditDialogComponent implements OnInit {
  get lang() { return lang; }
  public contact: Contact;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: {
      contact: Contact
    }
  ) {
    this.contact = data.contact;
  }

  ngOnInit() {
  }

  public spliceNem(index: number, del?: boolean) {
    del ? this.contact.nem.splice(index, 1) : this.contact.nem.splice(index, 0, {} as any);
  }

  public translation = {
    editContact: {
      en: "Edit contact",
      ja: "コンタクトを編集"
    } as any,
    name: {
      en: "Name",
      ja: "名前"
    } as any,
    address: {
      en: "Address",
      ja: "アドレス"
    } as any,
    memo: {
      en: "Memo",
      ja: "メモ"
    } as any
  }
}
