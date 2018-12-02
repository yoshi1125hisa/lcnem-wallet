import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Contact } from '../../../../../../firebase/functions/src/models/contact';
import { Invoice } from '../../../models/invoice';
import { Router } from '@angular/router';
import { ContactEditDialogComponent } from '../contact-edit-dialog/contact-edit-dialog.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../store/index'
import { AngularFireAuth } from '@angular/fire/auth';
import { UpdateContact } from 'src/app/store/contact/contact.actions';
import { LanguageService } from 'src/app/services/language.service';
import { state } from '@angular/animations';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.css']
})

export class ContactDialogComponent {
  public loading$: Observable<boolean>;

  get lang() { return this.language.twoLetter }

  public id: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: {
      id: string
    },
    private language: LanguageService,
    private auth: AngularFireAuth,
    private store: Store<State>,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.loading$ = store.select(state => state.contact.loading)
    this.id = data.id;
  }

  public updateContact() {
    const uid = this.auth.auth.currentUser!.uid;
    this.dialog.open(ContactEditDialogComponent, {
      data: {
        contact: this._contact
      }
    }).afterClosed().subscribe((result: Contact) => {
      if (!result) {
        return;
      }
      this.store.dispatch(new UpdateContact({ userId: uid, id: this.id, contact: result }))
    })
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
