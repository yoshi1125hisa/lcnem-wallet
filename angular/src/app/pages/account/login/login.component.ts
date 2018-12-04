import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterService } from '../../../services/router/router.service';
import { UserService } from '../../../services/user/user.service';
import { LanguageService } from '../../../services/language/language.service';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../../../components/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  get lang() { return this.language.state.twoLetter; }

  public agree = false;
  public safeSite: SafeResourceUrl;

  private subscription = this.user.state$.subscribe(
    (state) => {
      if(state.currentUser) {
        this.user.loadUser(state.currentUser.uid)
        this.router.navigate([""])
        return
      }
      if(state.error) {
        this.dialog.open(
          AlertDialogComponent,
          {
            data: {
              title: "",
              content: ""
            }
          }
        )
      }
    }
  )

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private _router: RouterService,
    private user: UserService,
    private language: LanguageService,
    sanitizer: DomSanitizer
  ) {
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/terms/${this.lang}.txt`);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
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
    } as any,
    error: {
      en: "Error",
      ja: "エラー"
    } as any,
    errorBodt: {
      en: "Please retry. It is recommended to delete caches.",
      ja: "再試行してください。キャッシュを削除することが推奨されます。"
    }
  };
}
