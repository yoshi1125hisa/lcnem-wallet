import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterService } from '../../../services/router/router.service';
import { LanguageService } from '../../../services/language/language.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
  get lang() { return this.language.code; }

  constructor(
    private language: LanguageService,
    private _router: RouterService,
    sanitizer: DomSanitizer
  ) {
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/privacy-policy/${this.lang}.txt`);
  }
  public safeSite: SafeResourceUrl;

  public translation = {
    privacyPolicy: {
      en: 'Privacy Policy',
      ja: 'プライバシーポリシー'
    } as any
  };

  ngOnInit() {
  }

  public back() {
    this._router.back(['']);
  }
}
