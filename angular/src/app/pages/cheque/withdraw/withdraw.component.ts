import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LanguageService } from '../../../services/language/language.service';
import { ApiService } from '../../../services/api/api.service';
import { RouterService } from '../../../services/router/router.service';
import { AuthService } from '../../../services/auth/auth.service';
import { WalletService } from '../../../services/user/wallet/wallet.service';
import { first } from 'rxjs/operators';
import { LoadingDialogComponent } from '../../../components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter }

  public readonly supportedCurrencies = [
    "JPY"
  ]

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

  public withdraw() {
    const dialog = this.dialog.open(LoadingDialogComponent, { disableClose: true })

    this.api.withdraw(
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
      en: "Completed. Please wait for an email.",
      ja: "送信しました。メールをお送りしますので少々お待ちください。"
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
    } as any,
    address: {
      en: "Address",
      ja: "アドレス"
    } as any
  }
}