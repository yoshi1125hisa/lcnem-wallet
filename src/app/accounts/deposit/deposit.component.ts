import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../services/global-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { HttpClient } from '@angular/common/http';

import { supportedCurrencies } from '../../../models/supported-currencies';
import { AngularFireAuth } from '@angular/fire/auth';
import { Wallet } from '../../../../models/wallet';
import { Address } from 'nem-library';

declare let Stripe: any;

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  public supportedCurrencies = supportedCurrencies;
  public selectedCurrency = "JPY";

  public minimum = {
    JPY: 1000
  } as { [key: string]: number };

  public amount?: number;
  public method?: string;

  constructor(
    public global: GlobalDataService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private auth: AngularFireAuth
  ) {
  }

  ngOnInit() {
    this.auth.authState.subscribe(async (user) => {
      if (user == null) {
        this.router.navigate(["accounts", "login"]);
        return;
      }
      await this.global.refreshWallet();
    });
  }

  public async deposit() {
    let dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

    try {
      await this.http.post(
        "/api/deposit",
        {
          email: this.auth.auth.currentUser!.email,
          nem: this.global.account.currentWallet!.address.plain(),
          currency: this.selectedCurrency,
          amount: this.amount,
          method: this.method,
          lang: this.global.lang
        }
      ).toPromise();
    } catch {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: this.translation.error[this.global.lang],
          content: ""
        }
      });
      return;
    } finally {
      dialogRef.close();
    }

    await this.dialog.open(AlertDialogComponent, {
      data: {
        title: this.translation.completed[this.global.lang],
        content: this.translation.following[this.global.lang]
      }
    }).afterClosed().toPromise();
    
    this.router.navigate(["/"]);
  }

  public translation = {
    amount: {
      en: "Amount",
      ja: "金額"
    } as any,
    currency: {
      en: "Currency",
      ja: "通貨"
    } as any,
    error: {
      en: "Error",
      ja: "エラー"
    } as any,
    completed: {
      en: "Completed",
      ja: "完了"
    } as any,
    following: {
      en: "Please wait for an email.",
      ja: "メールをお送りしますので少々お待ちください。"
    } as any,
    deposit: {
      en: "Deposit",
      ja: "入金"
    } as any,
    method: {
      en: "Method",
      ja: "方法"
    } as any,
    paypal: {
      en: "Paypal",
      ja: "Paypal"
    } as any,
    address: {
      en: "Address",
      ja: "アドレス"
    } as any
  };
}
