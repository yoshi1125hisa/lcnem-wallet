import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../../../../../../firebase/functions/src/models/contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @Input() contact?: Contact

  constructor() { }

  ngOnInit() {
    if(!this.contact) {
      this.contact = {} as any
    }
  }

}
