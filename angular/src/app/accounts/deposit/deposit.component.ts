import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';

import { AngularFireAuth } from '@angular/fire/auth';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { State } from '../../store/index'
import { Observable, Subscription } from 'rxjs';
import { LanguageService } from '../../services/language/language.service';
import { Back, Navigate } from '../../store/router/router.actions';
import { SendDepositRequest } from '../../store/api/deposit/deposit.actions';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit, OnDestroy {
  public get lang() { return this.language.twoLetter; }

  public readonly supportedCurrencies = [
    "JPY"
  ];
  public readonly minimum = {
    "JPY": 1000
  };
  
  public forms: {
    currency: string,
    address?: string;
    amount?: number;
    method?: string;
  } = {
    currency: "JPY"
  };

  public safeSite: SafeResourceUrl;

  private loadingDialog?: MatDialogRef<LoadingDialogComponent>;
  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<State>,
    private language: LanguageService,
    private dialog: MatDialog,
    private auth: AngularFireAuth,
    sanitizer: DomSanitizer
  ) {
    this.subscriptions.push(
      this.store.select(state => state.apiDeposit).subscribe(
        (state) => {
          if (state.loading && !this.loadingDialog) {
            this.loadingDialog = this.dialog.open(LoadingDialogComponent, { disableClose: true });
          } else if (this.loadingDialog) {
            this.loadingDialog.close();

            if(state.error) {
              this.dialog.open(
                AlertDialogComponent,
                {
                  data: {
                    title: this.translation.error[this.lang],
                    content: ""
                  }
                }
              );
              return;
            }

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
                this.store.dispatch(new Navigate({ commands: [""] }));
              }
            );
          }
        }
      )
    );

    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/stable-coin/${this.lang}.txt`);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public deposit() {
    this.store.dispatch(new SendDepositRequest(
      {
        email: this.auth.auth.currentUser!.email!,
        nem: this.forms.address!,
        currency: this.forms.currency,
        amount: this.forms.amount!,
        method: this.forms.method!,
        lang: this.lang
      }
    ));
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
