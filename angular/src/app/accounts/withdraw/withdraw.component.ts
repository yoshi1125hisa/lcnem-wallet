import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { from, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { Navigate } from 'src/app/store/router/router.actions';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { State } from '../../store/index'
import { LanguageService } from '../../services/language.service';
import { SendWithdrawRequest, SendWithdrawRequestSuccess, SendWithdrawRequestFailed } from '../../store/api/withdraw/withdraw.actions';
import { dispatch } from 'rxjs/internal/observable/pairs';


@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
  public loading$: Observable<boolean>;
  public supportedCurrencies = ["JPY"];
  public selectedCurrency = "JPY";
  public get lang() { return this.language.twoLetter; }

  public amount?: number;
  public method?: string;

  public safeSite: SafeResourceUrl;

  constructor(
    private store: Store<State>,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private auth: AngularFireAuth,
    private language: LanguageService,
    sanitizer: DomSanitizer
  ) {
    this.loading$ = store.select(state => state.wallet.loading)
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/stable-coin/${this.lang}.txt`);
  }

  ngOnInit() {
  }

  public  withdraw() {
    this.dialog.open(LoadingDialogComponent, { disableClose: true }).afterClosed().subscribe( x =>
    this.store.dispatch(new SendWithdrawRequest(this.http.post(
      "/api/withdraw",
      {
        email: this.auth.auth.currentUser!.email,
        nem: this.wallet.wallets![this.wallet.currentWallet!].nem,
        currency: this.selectedCurrency,
        amount: this.amount,
        method: this.method,
        lang: this.lang
      }
    ))));
    this.dialog.open(AlertDialogComponent, {
    data: {
      title: this.translation.completed[this.lang],
      content: this.translation.following[this.lang]
    }
  })
  }

  public back(){
    this.store.dispatch(new Navigate({ commands: [""]}))
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