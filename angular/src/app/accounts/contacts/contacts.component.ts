import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Contact } from '../../../../../firebase/functions/src/models/contact';
import { ContactsService } from '../../services/contacts.service';
import { back } from '../../../models/back';
import { lang } from '../../../models/lang';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { Invoice } from '../../../models/invoice';
import { PromptDialogComponent } from '../../components/prompt-dialog/prompt-dialog.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  public loading = true;
  get lang() { return lang; }
  public contacts!: {
    [id: string]: Contact
  };
  public contactIds: string[] = [];

  constructor(
    private router: Router,
    private user: UserService,
    private contact: ContactsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.user.checkLogin().then(async () => {
      await this.refresh();
    });
  }

  public async refresh(force?: boolean) {
    this.loading = true;
    await this.contact.readContacts(force);

    this.contacts = this.contact.contacts!;
    this.contactIds = Object.keys(this.contact.contacts!);

    this.loading = false;
  }

  public back() {
    back(() => this.router.navigate([""]));
  }

  public async createContact() {
    await this.updateContact();
  }

  public async updateContact(id?: string) {
    let result = await this.dialog.open(PromptDialogComponent, {
      data: {
        title: this.translation.createContact[this.lang],
        input: {
          placeholder: this.translation.name[this.lang],
          pattern: "\\S+",
          value: id ? this.contact.contacts![id].name : ""
        }
      }
    }).afterClosed().toPromise();

    if(!result) {
      return;
    }

    id ? await this.contact.updateContact(id, { name: result }) : await this.contact.createContact({ name: result, nem: []});
    this.contactIds = Object.keys(this.contact.contacts!);
  }

  public async deleteContact(id: string) {
    let result = await this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translation.confirm[this.lang]
      }
    }).afterClosed().toPromise();

    if(!result) {
      return;
    }

    await this.contact.deleteContact(id);
    this.contactIds = Object.keys(this.contact.contacts!);
  }

  public async createContactElement(id: string) {
    let result: {
      type: string,
      value: string
    } = await this.dialog.open(ContactDialogComponent).afterClosed().toPromise();

    if(!result) {
      return;
    }

    if(result.type == "nem") {
      this.contact.contacts![id].nem.push(result.value);
    }
    await this.contact.updateContact(id, this.contact.contacts![id])
  }

  public async deleteContactElement(type: string, id: string, index: number) {
    if(type == "nem") {
      this.contact.contacts![id].nem.splice(index, 1);
    }
    await this.contact.updateContact(id, this.contact.contacts![id])
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
