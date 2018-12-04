import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Asset, NEMLibrary, NetworkTypes } from 'nem-library';
import { Observable, of } from 'rxjs';
import { map, mergeMap, first } from 'rxjs/operators';
import { LanguageService } from '../../services/language/language.service';
import { UserService } from '../../services/user/user.service';
import { WalletService } from '../../services/wallet/wallet.service';
import { Invoice } from '../../classes/invoice';

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

  public currentWallet$ = this.wallet.state$.pipe(
    map(state => state.entities[state.currentWalletId!])
  )

  public qrUrl$ = this.currentWallet$.pipe(
    map(currentWallet => {
      let invoice = new Invoice();
      invoice.data.addr = currentWallet.nem;
      return "https://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=" + encodeURI(invoice.stringify());
    })
  )

  constructor(
    private language: LanguageService,
    private user: UserService,
    private wallet: WalletService
  ) {
  }

  ngOnInit() {
  }

  public logout() {
    this.user.logout()
  }

  public copyAddress() {
  }

  public translation = {
    balance: {
      en: "Balance",
      ja: "残高"
    } as any,
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
      en: "Scan QR-code",
      ja: "QRコードをスキャン"
    } as any,
    history: {
      en: "History",
      ja: "履歴"
    } as any,
    deposit: {
      en: "Deposit",
      ja: "入金"
    } as any,
    withdraw: {
      en: "Withdraw",
      ja: "出金"
    } as any,
    yourAddress: {
      en: "Your address",
      ja: "あなたのアドレス"
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
    copy: {
      en: "Copy this Address",
      ja: "アドレスをコピーする"
    } as any,
    contacts: {
      en: "Contact list",
      ja: "コンタクトリスト"
    } as any,
    cosignatoryOf: {
      en: "Multisig addresses you can cosign",
      ja: "連署名できるマルチシグアドレス"
    } as any
  };
}
