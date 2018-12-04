import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language/language.service';

@Component({
  selector: 'app-language-menu',
  templateUrl: './language-menu.component.html',
  styleUrls: ['./language-menu.component.css']
})
export class LanguageMenuComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter; }

  constructor(
    private language: LanguageService
  ) { }

  ngOnInit() {
  }

  public setLanguage(twoLetter: string) {
    this.language.setLanguage(twoLetter)
  }

}
