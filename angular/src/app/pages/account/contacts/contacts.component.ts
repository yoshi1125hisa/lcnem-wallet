import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ContactEditDialogComponent } from './contact-edit-dialog/contact-edit-dialog.component';
import { filter, first, map } from 'rxjs/operators';
import { LanguageService } from '../../../services/language/language.service';
import { RouterService } from '../../../services/router/router.service';
import { AuthService } from '../../../services/auth/auth.service';
import { combineLatest } from 'rxjs';
import * as fromContact from '../../../services/user/contact/contact.reducer'
import { Store } from '@ngrx/store';
import { LoadContacts, AddContact, UpdateContact, DeleteContact } from 'src/app/services/user/contact/contact.actions';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})

export class ContactsComponent implements OnInit {
  get lang() { return this.language.code }

  public loading$ = combineLatest(
    this.auth.user$,
    this.contact$
  ).pipe(
    map(([auth, contact]) => auth === null || contact.loading)
  )

  public state$ = this.contact$

  constructor(
    private dialog: MatDialog,
    private _router: RouterService,
    private language: LanguageService,
    private auth: AuthService,
    private contact$: Store<fromContact.State>
  ) {
  }

  ngOnInit() {
    this.load()
  }

  public async load(refresh?: boolean) {
    const user = await this.auth.user$.pipe(
      filter(user => user !== null),
      first()
    ).toPromise()

    this.contact$.dispatch(new LoadContacts({ userId: user!.uid, refresh: refresh }))
  }

  public back() {
    this._router.back([""])
  }

  public async createContact() {
    const result = await this.dialog.open(
      ContactEditDialogComponent,
      {
        data: {
          contact: {}
        }
      }
    ).afterClosed().toPromise()

    if (!result) {
      return
    }

    this.contact$.dispatch(new AddContact({ userId: this.auth.user!.uid, contact: result }))
  }

  public async editContact(id: string) {
    const contact = await this.dialog.open(
      ContactEditDialogComponent,
      {
        data: {
          contact: (await this.contact$.pipe(first()).toPromise()).entities[id]
        }
      }
    ).afterClosed().toPromise()

    if (!contact) {
      return
    }

    this.contact$.dispatch(new UpdateContact({ userId: this.auth.user!.uid, contactId: id, contact: contact }))
  }

  public deleteContact(id: string) {
    const result = window.confirm(this.translation.confirm[this.lang])

    if (!result) {
      return
    }

    this.contact$.dispatch(new DeleteContact({ userId: this.auth.user!.uid, contactId: id }))
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
    } as any,
    createContact: {
      en: "Create new contact",
      ja: "新しいコンタクトを作成"
    } as any,
    name: {
      en: "Name",
      ja: "名前"
    } as any
  }
}
