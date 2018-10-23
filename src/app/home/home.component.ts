import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataService } from '../services/global-data.service';
import { Invoice } from '../../models/invoice';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../components/alert-dialog/alert-dialog.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { Asset } from 'nem-library';
import { Share } from '../../models/share';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public loading = true;
  public address = "";
  public qrUrl = "";
  public assets: Asset[] = [];
  public progress = 0;

  constructor(
    public global: GlobalDataService,
    private router: Router,
    private dialog: MatDialog,
    private auth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.auth.authState.subscribe(async (user) => {
      if (user == null) {
        this.router.navigate(["accounts", "login"]);
        return;
      }
      await this.refresh();
    });
  }

  public async logout() {
    await this.auth.auth.signOut();
    this.global.refreshed = false;

    this.dialog.open(AlertDialogComponent, {
      data: {
        title: this.translation.completed[this.global.lang],
        content: ""
      }
    }).afterClosed().subscribe(() => {
      this.router.navigate(["accounts", "login"]);
    });
  }

  public async refresh(force?: boolean) {
    this.loading = true;
    this.progress = 0
    await this.global.refreshWallet(force);
    this.progress = 30;
    let invoice = new Invoice();
    this.progress = 40;
    invoice.data.addr = this.global.account.currentWallet!.wallet.address.plain();
    this.progress = 50;
    this.qrUrl = "https://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=" + encodeURI(invoice.stringify());
    this.progress = 60;
    this.address = this.global.account.currentWallet!.wallet.address.pretty();
    this.progress = 70;

    this.assets = this.global.account.currentWallet!.assets!.map(a => a.asset);
    this.progress = 100;

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
      en: "Wallets",
      ja: "ウォレット"
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
      en: "Address book",
      ja: "アドレス帳"
    } as any
  };
}
