import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AngularFireAuth } from '@angular/fire/auth';
import { Asset, NEMLibrary, NetworkTypes } from 'nem-library';
import { Store } from '@ngrx/store';
import { State } from '../store/index'
import { Invoice } from '../models/invoice';

NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public address = "";
  public qrUrl = "";
  public assets: Asset[] = [];
  public photoUrl = "";

  constructor(
    private store: Store<State>,
    private dialog: MatDialog,
    private auth: AngularFireAuth
  ) {
    
  }

  ngOnInit() {
    this.user.checkLogin().then(async () => {
      await this.wallet.checkWallets();
      await this.refresh();
    });
  }

  public async logout() {
    await this.user.logout();
  }

  public refresh = async (force?: boolean) => {
    this.loading = true;

    await this.balance.readAssets(force);

    this.address = this.wallet.wallets![this.wallet.currentWallet!].nem;
    this.photoUrl = this.auth.auth.currentUser!.photoURL!;
    this.assets = this.balance.assets!;

    let invoice = new Invoice();
    invoice.data.addr = this.address;
    this.qrUrl = "https://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=" + encodeURI(invoice.stringify());

    this.loading = false;
  }

  copyMessage(val: string) {
    Share.copyMessage(val);
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
