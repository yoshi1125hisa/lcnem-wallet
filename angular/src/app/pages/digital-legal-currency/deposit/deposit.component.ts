import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { RouterService } from '../../../services/router/router.service';
import { LanguageService } from '../../../services/language/language.service';
import { ApiService } from '../../../services/api/api.service';
import { AuthService } from '../../../services/auth/auth.service';
import { WalletService } from '../../../services/wallet/wallet.service';
import { first } from 'rxjs/operators';
import { LoadingDialogComponent } from '../../../components/loading-dialog/loading-dialog.component';

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
  } as { [lang: string]: number }

  public forms: {
    address?: string
    currency: string
    amount?: number
    method?: string
  } = {
      currency: "JPY"
    }

  public safeSite: SafeResourceUrl

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _router: RouterService,
    private auth: AuthService,
    private wallet: WalletService,
    private language: LanguageService,
    private api: ApiService,
    sanitizer: DomSanitizer
  ) {
    this.wallet.state$.pipe(
      first()
    ).subscribe(
      (state) => {
        if (state.currentWalletId) {
          this.forms.address = state.entities[state.currentWalletId].nem
        }
      }
    )
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/stable-coin/${this.lang}.txt`);
  }

  ngOnInit() {
  }

  public deposit() {
    const dialog = this.dialog.open(LoadingDialogComponent, { disableClose: true })

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
        this.snackBar.open(this.translation.completed[this.lang], undefined, { duration: 6000 })
        this.back()
      },
      (error) => {
        this.snackBar.open(this.translation.error[this.lang], undefined, { duration: 6000 })
      },
      () => {
        dialog.close()
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
      en: "Completed. Please wait for an email.",
      ja: "送信しました。メールをお送りしますので少々お待ちください。"
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
      en: "PayPal",
      ja: "PayPal"
    } as any,
    address: {
      en: "Address",
      ja: "アドレス"
    } as any
  };
}
