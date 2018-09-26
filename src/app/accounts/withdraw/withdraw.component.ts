import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../services/global-data.service';
import { Router } from '@angular/router';
import { supportedCurrencies } from '../../../models/supported-currencies';
import { MatDialog } from '@angular/material';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { HttpClient } from '@angular/common/http';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
  public supportedCurrencies = supportedCurrencies;
  public selectedCurrency = "JPY";

  public amount?: number;
  public method?: string;

  public safeSite: SafeResourceUrl;

  constructor(
    public global: GlobalDataService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    sanitizer: DomSanitizer
  ) {
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/stable-coin/${global.lang}.txt`);
  }

  ngOnInit() {
    this.global.auth.authState.subscribe((user) => {
      if (user == null) {
        this.router.navigate(["/accounts/login"]);
        return;
      }
      this.global.initialize().then(() => {
      });
    });
  }

  public async withdraw() {
    let dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

    try {
      await this.http.post(
        "https://us-central1-lcnem-wallet.cloudfunctions.net/withdraw",
        {
          email: this.global.auth.auth.currentUser!.email,
          nem: this.global.account!.address.plain(),
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

    this.dialog.open(AlertDialogComponent, {
      data: {
        title: this.translation.completed[this.global.lang],
        content: this.translation.following[this.global.lang]
      }
    }).afterClosed().subscribe(() => {
      this.router.navigate(["/"]);
    });
  }

  public translation = {
    amazonGift: {
      en: "Amazon Gift Card",
      ja: "アマゾンギフトカード"
    },
    amount: {
      en: "Amount",
      ja: "金額"
    },
    currency: {
      en: "currency",
      ja: "通貨"
    },
    completed: {
      en: "Completed",
      ja: "完了"
    },
    following: {
      en: "Please wait for an email.",
      ja: "メールをお送りしますので少々お待ちください。"
    },
    error: {
      en: "Error",
      ja: "エラー"
    },
    type: {
      en: "Type",
      ja: "種類"
    },
    withdraw: {
      en: "Withdraw",
      ja: "出金"
    }
  } as { [key: string]: { [key: string]: string } };
}