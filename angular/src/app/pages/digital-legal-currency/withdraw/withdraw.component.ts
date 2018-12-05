import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LanguageService } from '../../../services/language/language.service';
import { UserService } from '../../../services/user/user.service';
import { ApiService } from '../../../services/api/api.service';
import { RouterService } from '../../../services/router/router.service';
import { AlertDialogComponent } from '../../../components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter; }

  public readonly supportedCurrencies = [
    "JPY"
  ];

  public forms: {
    currency: string,
    address?: string;
    amount?: number;
    method?: string;
  } = {
      currency: "JPY"
    };

  public safeSite: SafeResourceUrl;

  public loading = false;
  public error?: Error;

  constructor(
    private dialog: MatDialog,
    private _router: RouterService,
    private user: UserService,
    private language: LanguageService,
    private api: ApiService,
    sanitizer: DomSanitizer
  ) {
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/stable-coin/${this.lang}.txt`);
  }

  ngOnInit() {
  }

  public withdraw() {
    this.api.withdraw(
      {
        email: this.user.user!.email!,
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