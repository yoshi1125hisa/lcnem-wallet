import { Component, OnInit, Input, Output } from '@angular/core';
import { Integration } from '../../../../../../../../../firebase/functions/src/models/integration';
import { EventEmitter } from 'events';
import { LanguageService } from '../../../../../../services/language/language.service';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.css']
})
export class IntegrationComponent implements OnInit {
  get lang() { return this.language.state.twoLetter }
  
  @Input() integration?: Integration

  @Output() delete = new EventEmitter()

  constructor(
    private language: LanguageService
  ) { }

  ngOnInit() {
  }

}
