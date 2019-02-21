import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { Contact } from '../../../../../../../firebase/functions/src/models/contact';
import { LanguageService } from '../../../../services/language/language.service';

@Component({
  selector: 'app-contact-edit-dialog',
  templateUrl: './contact-edit-dialog.component.html',
  styleUrls: ['./contact-edit-dialog.component.css']
})
export class ContactEditDialogComponent implements OnInit {
  get lang() { return this.language.code; }

  constructor(
    private language: LanguageService,
    @Inject(MAT_DIALOG_DATA) data: {
      contact: Contact
    }
  ) {
    this.contact = JSON.parse(JSON.stringify(data.contact));
    if (!this.contact.nem) {
      this.contact.nem = [];
    }
  }

  public contact: Contact;

  public translation = {
    editContact: {
      en: 'Edit contact',
      ja: 'コンタクトを編集'
    } as any,
    name: {
      en: 'Name',
      ja: '名前'
    } as any,
    address: {
      en: 'Address',
      ja: 'アドレス'
    } as any,
    memo: {
      en: 'Memo',
      ja: 'メモ'
    } as any
  };

  ngOnInit() {
  }

  public pushNem() {
    this.contact.nem.push({} as any);
  }

  public removeNem(index: number) {
    this.contact.nem.splice(index, 1);
  }
}
