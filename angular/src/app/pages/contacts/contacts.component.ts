import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ContactEditDialogComponent } from './contact-edit-dialog/contact-edit-dialog.component';
import { filter, first, map } from 'rxjs/operators';
import { LanguageService } from '../../services/language/language.service';
import { RouterService } from '../../services/router/router.service';
import { ContactService } from '../../services/contact/contact.service';
import { AuthService } from '../../services/auth/auth.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})

export class ContactsComponent implements OnInit {
  get lang() { return this.language.state.twoLetter }

  public loading$ = combineLatest(
    this.auth.user$,
    this.contact.state$
  ).pipe(
    map(([auth, contact]) => auth === null || contact.loading)
  )

  public state$ = this.contact.state$

  constructor(
    private dialog: MatDialog,
    private _router: RouterService,
    private language: LanguageService,
    private auth: AuthService,
    private contact: ContactService
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

    this.contact.loadContacts(user!.uid, refresh)
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

    this.contact.addContact(this.auth.user!.uid, result)
  }

  public async editContact(id: string) {
    const name = await this.dialog.open(
      ContactEditDialogComponent,
      {
        data: {
          contact: this.contact.state.entities[id]
        }
      }
    ).afterClosed().toPromise()

    if (!name) {
      return
    }

    this.contact.updateContact(this.auth.user!.uid, id, name)
  }

  public deleteContact(id: string) {
    const result = window.confirm(this.translation.confirm[this.lang])

    if (!result) {
      return
    }
    
    this.contact.deleteContact(this.auth.user!.uid, id)
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
  };

}
