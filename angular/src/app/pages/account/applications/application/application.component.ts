import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Application } from '../../../../../../../firebase/functions/src/models/application';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  @Input() id?: string;
  @Input() application?: Application;

  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
