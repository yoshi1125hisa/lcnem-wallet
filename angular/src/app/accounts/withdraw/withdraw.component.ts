import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { lang } from '../../../models/lang';
import { WalletsService } from '../../../app/services/wallets.service';
import { back } from '../../../models/back';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
  get lang() { return lang; }
  public supportedCurrencies = ["JPY"];
  public selectedCurrency = "JPY";

  public amount?: number;
  public method?: string;

  public safeSite: SafeResourceUrl;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private auth: AngularFireAuth,
    private user: UserService,
    private wallet: WalletsService,
    sanitizer: DomSanitizer
  ) {
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/stable-coin/${this.lang}.txt`);
  }

  ngOnInit() {
    this.user.checkLogin().then(async () => {
      await this.wallet.checkWallets();
    });
  }

  public async withdraw() {
    let dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

    try {
      await this.http.post(
        "/api/withdraw",
        {
          email: this.auth.auth.currentUser!.email,
          nem: this.wallet.wallets![this.wallet.currentWallet!].nem,
          currency: this.selectedCurrency,
          amount: this.amount,
          method: this.method,
          lang: this.lang
        }
      ).toPromise();
    } catch {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: this.translation.error[this.lang],
          content: ""
        }
      });
      return;
    } finally {
      dialogRef.close();
    }

    await this.dialog.open(AlertDialogComponent, {
      data: {
        title: this.translation.completed[this.lang],
        content: this.translation.following[this.lang]
      }
    }).afterClosed().toPromise();
    
    this.router.navigate([""]);
  }

  public back() {
    back(() => this.router.navigate([""]));
  }

  public translation = {
    amazonGift: {
      en: "Amazon Gift Card",
      ja: "アマゾンギフトカード"
    } as any,
    amount: {
      en: "Amount",
      ja: "金額"
    } as any,
    currency: {
      en: "currency",
      ja: "通貨"
    } as any,
    completed: {
      en: "Completed",
      ja: "完了"
    } as any,
    following: {
      en: "Please wait for an email.",
      ja: "メールをお送りしますので少々お待ちください。"
    } as any,
    error: {
      en: "Error",
      ja: "エラー"
    } as any,
    type: {
      en: "Type",
      ja: "種類"
    } as any,
    withdraw: {
      en: "Withdraw",
      ja: "出金"
    } as any
  };
}