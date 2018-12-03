import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { back } from '../../models/back';
import { lang, setLang } from '../../models/lang';
import { UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../store/index'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loading$: Observable<boolean>;
  get lang() { return lang; }
  set lang(value: string) { setLang(value); }
  public agree = false;
  public safeSite: SafeResourceUrl;

  constructor(
    public store: Store<State>,
    public router: Router,
    private user: UserService,
    sanitizer: DomSanitizer
  ) {
    this.loading$ = store.select(state => state.user.loading)
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
