import { Component, OnInit, Inject } from '@angular/core';
import { Contact } from '../../../../../../firebase/functions/src/models/contact';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../store/index'
import { LanguageService } from '../../../services/language/language.service';

@Component({
  selector: 'app-contact-edit-dialog',
  templateUrl: './contact-edit-dialog.component.html',
  styleUrls: ['./contact-edit-dialog.component.css']
})
export class ContactEditDialogComponent implements OnInit {
  public loading$: Observable<boolean>;
  get lang() { return this.language.twoLetter; }
  public contact: Contact;

  constructor(
    private language: LanguageService,
    private store: Store<State>,
    @Inject(MAT_DIALOG_DATA) data: {
      contact: Contact
    }
  ) {
    this.loading$ = store.select(state => state.contact.loading)
    this.contact = JSON.parse(JSON.stringify(data.contact));
    if (!this.contact.nem) {
      this.contact.nem = [];
    }
  }

  ngOnInit() {
  }

  public pushNem = () => this.contact.nem.push({} as any);
  public removeNem = (index: number) => this.contact.nem.splice(index, 1);

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
