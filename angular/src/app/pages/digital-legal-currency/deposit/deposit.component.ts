import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AngularFireAuth } from '@angular/fire/auth';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { RouterService } from '../../../services/router/router.service';
import { LanguageService } from '../../../services/language/language.service';
import { ApiService } from '../../../services/api/api.service';
import { AlertDialogComponent } from '../../../components/alert-dialog/alert-dialog.component';
import { AuthService } from '../../../services/auth/auth.service';
import { WalletService } from '../../../services/wallet/wallet.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter }

  public readonly supportedCurrencies = [
    "JPY"
  ]
  public readonly minimum = {
    "JPY": 1000
  }

  public forms: {
    address?: string
    currency: string
    amount?: number
    method?: string
  } = {
      currency: "JPY"
    };

  public safeSite: SafeResourceUrl

  constructor(
    private dialog: MatDialog,
    private _router: RouterService,
    private auth: AuthService,
    private wallet: WalletService,
    private language: LanguageService,
    private api: ApiService,
    sanitizer: DomSanitizer
  ) {
    const subscription = this.wallet.state$.subscribe(
      (state) => {
        if (state.currentWalletId) {
          this.forms.address = state.entities[state.currentWalletId].nem
        }
        subscription.unsubscribe()
      }
    )
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/stable-coin/${this.lang}.txt`);
  }

  ngOnInit() {
  }

  public deposit() {
    this.api.deposit(
      {
        email: this.auth.user!.email!,
        nem: this.forms.address!,
        currency: this.forms.currency,
        amount: this.forms.amount!,
        method: this.forms.method!,
        lang: this.lang
      }
    ).subscribe(
      () => {
        this.dialog.open(
          AlertDialogComponent,
          {
            data: {
              title: this.translation.completed[this.lang],
              content: this.translation.following[this.lang]
            }
          }
        ).afterClosed().subscribe(
          (_) => {
            this.back()
          }
        );
      },
      (error) => {
        this.dialog.open(
          AlertDialogComponent,
          {
            data: {
              title: this.translation.error[this.lang],
              content: ""
            }
          }
        );
      }
    )
  }

  public back() {
    this._router.back([""])
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
