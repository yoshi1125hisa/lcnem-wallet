import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { HttpClient } from '@angular/common/http';

import { AngularFireAuth } from '@angular/fire/auth';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { State } from '../../store/index'
import { Observable } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { Back, Navigate } from '../../store/router/router.actions';
import { SendDepositRequest } from '../../store/api/deposit/deposit.actions';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  public get lang() { return this.language.twoLetter; }

  public loading$: Observable<boolean>;

  public readonly supportedCurrencies = [
    {
      name: "JPY",
      minimum: 1000
    }
  ];
  public selectedCurrency = "JPY";

  public forms: {
    address?: string;
    amount?: number;
    method?: string; 
  } = {};

  public safeSite: SafeResourceUrl;

  constructor(
    private store: Store<State>,
    private language: LanguageService,
    private dialog: MatDialog,
    private http: HttpClient,
    private auth: AngularFireAuth,
    sanitizer: DomSanitizer
  ) {
    this.loading$ = store.select(state => state.wallet.loading)
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/stable-coin/${this.lang}.txt`);
  }

  ngOnInit() {
  }

  public async deposit() {
    let dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

    this.store.dispatch(new SendDepositRequest(
      {
        email: this.auth.auth.currentUser!.email!,
        nem: this.forms.address!,
        currency: this.selectedCurrency,
        amount: this.forms.amount!,
        method: this.forms.method!,
        lang: this.lang
      }
    ));

    try {
      
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

    this.store.dispatch(new Navigate({ commands: [""] }))
  }

  public back() {
    this.store.dispatch(new Back({ commands: [""] }));
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
