import { Component, OnInit, Inject } from '@angular/core';
import { Contact } from '../../../../../../firebase/functions/src/models/contact';
import { lang } from '../../../../models/lang';
import { MAT_DIALOG_DATA } from '@angular/material';
import { NemAddress } from '../../../../models/nem-address';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.css']
})
export class ContactDialogComponent implements OnInit {
  get lang() { return lang; }

  public contact: Contact;
  public suggests: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      contact: Contact
    }
  ) {
    this.contact = Object.assign({}, data.contact);
    if(!this.contact.nem || !this.contact.name.length) {
      this.contact.nem = [""];
    } else {
      this.contact.nem = data.contact.nem.concat();
    }
  }

  ngOnInit() {
  }

  public spliceNem(index: number) {
    this.contact.nem.splice(index, 1);
  }

  public pushNem() {
    this.contact.nem.push("");
  }

  public onNemChange(index: number) {
    NemAddress.format({input: this.contact.nem[index]});
  }
  
  public translation = {
    name: {
      en: "Name",
      ja: "名前"
    } as any
  }
}
