import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { from } from 'rxjs';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterService } from '../../../services/router/router.service';
import { UserService } from '../../../services/user/user.service';
import { LanguageService } from '../../../services/language/language.service';
import { AlertDialogComponent } from '../../../components/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  get lang() { return this.language.state.twoLetter; }

  public agree = false;
  public safeSite: SafeResourceUrl;

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

  public setLanguage(twoLetter: string) {
    this.language.setLanguage(twoLetter)
  }

  public back() {
    this._router.back([""])
  }

  public login() {
    from(this.user.login()).subscribe(
      (user) => {
        this.router.navigate([""])
      },
      (error) => {
        this.dialog.open(
          AlertDialogComponent,
          {
            data: {
              title: this.translation.error[this.lang],
              content: this.translation.errorBody[this.lang]
            }
          }
        )
      }
    )
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
    errorBody: {
      en: "Please retry. It is recommended to delete caches.",
      ja: "再試行してください。キャッシュを削除することが推奨されます。"
    } as any
  };
}
