import { Component, OnInit } from '@angular/core';
import { lang } from '../../../../models/lang';
import { NemAddress } from '../../../../models/nem-address';
import { ContactsService } from '../../../services/contacts.service';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.css']
})
export class ContactDialogComponent implements OnInit {
  get lang() { return lang; }

  public ret: {
    type: string,
    value: string
  } = {
      type: "nem",
      value: ""
    };
  public suggests: string[] = [];

  constructor(
    private contact: ContactsService
  ) {
  }

  ngOnInit() {
  }

  public pattern: {
    [type: string]: string
  } = {
      nem: "N[A-Z2-7]{39}"
    }

  public async onChange() {
    if (this.ret.type == "nem") {
      this.suggests = await NemAddress.suggest(this.ret.value, this.contact);
    }
  }

  public translation = {
    type: {
      en: "Type",
      ja: "種類"
    } as any,
    name: {
      en: "Name",
      ja: "名前"
    } as any,
    addAddress: {
      en: "Add an address",
      ja: "アドレスを追加"
    },
    address: {
      en: "Address",
      ja: "アドレス"
    }
  }
}
