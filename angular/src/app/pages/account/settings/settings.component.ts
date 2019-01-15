import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { LanguageService } from '../../../services/language/language.service';
import { RouterService } from '../../../services/router/router.service';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { filter, map, first } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private language: LanguageService,
    private auth: AuthService,
    private user: UserService,
    private _router: RouterService,
  ) { }
  public get lang() { return this.language.state.twoLetter }

  public plan$ = this.user.state$.pipe(
    filter(state => !state.loading),
    map(state => state.user!.plan),
    map(plan => plan ? plan.type : "Free")
  )

  ngOnInit() {
    this.load()
  }

  public back() {
    this._router.back([""])
  }

  public async load(refresh?: boolean) {
    const user = await this.auth.user$.pipe(
      filter(user => user != null),
      first()
    ).toPromise()

    this.user.loadUser(user!.uid, refresh)
  }
  
  public async logout() {
    await this.auth.logout()

    this.snackBar.open(this.translation.logoutCompleted[this.lang])

    await this.router.navigate(["account", "login"])
  }

  public translation = {
    setting: {
      en: "Setting",
      ja: "設定"
    } as any,
    account: {
      en: "Account",
      ja: "アカウント"
    } as any,
    plan: {
      en: "Plan",
      ja: "プラン"
    } as any,
    logout: {
      en: "Logout",
      ja: "ログアウト"
    } as any,
    logoutCompleted: {
      en: "Successfully logged out.",
      ja: "正常にログアウトしました。"
    } as any,
    terms: {
      en: "Terms of Service",
      ja: "利用規約"
    } as any,
    privacyPolicy: {
      en: "Privacy Policy",
      ja: "プライバシーポリシー"
    } as any,
    company: {
      en: "Company",
      ja: "企業情報"
    } as any
  }
}
