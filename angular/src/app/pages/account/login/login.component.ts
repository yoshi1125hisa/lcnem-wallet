import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth/auth.service';
import { LanguageService } from '../../../services/language/language.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  get lang() { return this.language.state.twoLetter }

  public agree = false
  public safeSite: SafeResourceUrl

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private language: LanguageService,
    sanitizer: DomSanitizer
  ) {
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/terms/${this.lang}.txt`)
  }

  ngOnInit() {
  }

  public setLanguage(twoLetter: string) {
    this.language.setLanguage(twoLetter)
  }

  public login() {
    this.auth.login().then(
      (user) => {
        this.router.navigate([""])
      },
      (error) => {
        this.snackBar.open(this.translation.error[this.lang], undefined, { duration: 6000 })
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
      en: "Failed to login. It is recommended to delete caches.",
      ja: "ログインに失敗しました。キャッシュを削除することが推奨されます。"
    } as any
  }
}
