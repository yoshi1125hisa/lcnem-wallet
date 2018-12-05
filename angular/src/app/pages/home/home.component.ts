import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap, first } from 'rxjs/operators';
import { Asset, NEMLibrary, NetworkTypes } from 'nem-library';
import { LanguageService } from '../../services/language/language.service';
import { UserService } from '../../services/user/user.service';

NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter; }

  public photoUrl$ = this.user.state$.pipe(
    map(state => state.currentUser),
    map(user => user && user.photoURL ? user.photoURL : "")
  )

  constructor(
    private language: LanguageService,
    private user: UserService
  ) {
  }

  ngOnInit() {
  }

  public logout() {
    this.user.logout()
  }

  public translation = {
    language: {
      en: "Language",
      ja: "言語"
    } as any,
    wallets: {
      en: "Change the wallet",
      ja: "ウォレットの切り替え"
    } as any,
    logout: {
      en: "Log out",
      ja: "ログアウト"
    } as any,
    transfer: {
      en: "Transfer",
      ja: "送信"
    } as any,
    scan: {
      en: "Scan QR",
      ja: "QRスキャン"
    } as any,
    deposit: {
      en: "Deposit",
      ja: "入金"
    } as any,
    withdraw: {
      en: "Withdraw",
      ja: "出金"
    } as any,
    terms: {
      en: "Terms of Service",
      ja: "利用規約"
    } as any,
    privacyPolicy: {
      en: "Privacy Policy",
      ja: "プライバシーポリシー"
    } as any,
    completed: {
      en: "Successfully logged out",
      ja: "正常にログアウトしました。"
    } as any,
    contacts: {
      en: "Contact list",
      ja: "コンタクトリスト"
    } as any
  };
}
