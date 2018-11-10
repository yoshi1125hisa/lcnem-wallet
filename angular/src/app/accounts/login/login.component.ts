import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { back } from '../../models/back';
import { lang, setLang } from '../../models/lang';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  get lang() { return lang; }
  set lang(value: string) { setLang(value); }
  public agree = false;
  public safeSite: SafeResourceUrl;

  constructor(
    public router: Router,
    private user: UserService,
    sanitizer: DomSanitizer
  ) {
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/terms/${this.lang}.txt`);
  }

  ngOnInit() {
  }

  public back() {
    back(() => this.router.navigate([""]));
  }

  public async login() {
    await this.user.login();
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
