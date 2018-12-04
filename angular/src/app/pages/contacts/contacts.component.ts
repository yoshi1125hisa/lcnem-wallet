import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ContactEditDialogComponent } from './contact-edit-dialog/contact-edit-dialog.component';
import { filter } from 'rxjs/operators';
import { LanguageService } from '../../services/language/language.service';
import { RouterService } from '../../services/router/router.service';
import { ContactService } from '../../services/contact/contact.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})

export class ContactsComponent implements OnInit {
  get lang() { return this.language.state.twoLetter }

  public state$ = this.contact.state$;

  constructor(
    private dialog: MatDialog,
    private _router: RouterService,
    private language: LanguageService,
    private user: UserService,
    private contact: ContactService
  ) {
  }

  ngOnInit() {
    this.load()
  }

  public load(refresh?: boolean) {
    const uid = this.user.state.currentUser!.uid

    this.contact.loadContacts(uid, refresh)
  }

  public back() {
    this._router.back([""])
  }

  public createContact() {
    this.dialog.open(
      ContactEditDialogComponent,
      {
        data: {
          contact: {}
        }
      }
    ).afterClosed().pipe(
      filter(result => result)
    ).subscribe(
      (result) => {
        const uid = this.user.state.currentUser!.uid
        this.contact.addContact(uid, result)
      }
    )
  }

  public editContact(id: string) {
    this.dialog.open(
      ContactEditDialogComponent,
      {
        data: {
          contact: this.contact.state.entities[id]
        }
      }
    )
  }

  public deleteContact(id: string) {
    this.dialog.open(
      ConfirmDialogComponent,
      {
        data: {
          title: this.translation.confirm[this.lang]
        }
      }
    ).afterClosed().pipe(
      filter(result => result)
    ).subscribe(
      (result) => {
        const uid = this.user.state.currentUser!.uid
        this.contact.deleteContact(uid, id)
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
