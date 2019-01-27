import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../../../../../../../firebase/functions/src/models/contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @Input() contact?: Contact

  @Output() delete = new EventEmitter()
  @Output() edit = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

}
