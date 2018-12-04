import { Component, OnInit } from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterService } from '../../../services/router/router.service';
import { UserService } from '../../../services/user/user.service';
import { LanguageService } from '../../../services/language/language.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  get lang() { return this.language.state.twoLetter; }

  public loading$: Observable<boolean>;
  public agree = false;
  public safeSite: SafeResourceUrl;

  constructor(
    public _router: RouterService,
    private user: UserService,
    private language: LanguageService,
    sanitizer: DomSanitizer
  ) {
    this.loading$ = this.user.state$.pipe(map(state => state.loading))
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/terms/${this.lang}.txt`);
  }

  ngOnInit() {
  }

  public setLanguage(twoLetter: string) {
    this.language.setLanguage(twoLetter)
  }

  public back() {
    this._router.back([""])
  }

  public login() {
    this.user.login()
  }

  public translation = {
    agree: {
      en: "I agree.",
      ja: "同意します"
    } as any,
    login: {
      en: "Log in",
      ja: "ログイン"
    } as any
  };
}
