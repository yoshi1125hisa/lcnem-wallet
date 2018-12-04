import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language/language.service';
import { RouterService } from '../../services/router/router.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  get lang() { return this.language.state.twoLetter; }

  public safeSite: SafeResourceUrl;
  constructor(
    private _router: RouterService,
    private language: LanguageService,
    sanitizer: DomSanitizer
  ) {
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/terms/${this.lang}.txt`);
  }

  ngOnInit() {
  }

  public back() {
    this._router.back([""])
  }

  public translation = {
    terms: {
      en: "Terms of Service",
      ja: "利用規約"
    } as any
  };
}
