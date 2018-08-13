import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../services/global-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { HttpClient } from '@angular/common/http';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { supportedCurrencies } from '../../../models/supported-currencies';

declare let Stripe: any;

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
    public supportedCurrencies = supportedCurrencies;
    public selectedCurrency = "JPY";

    public amount?: number;
    public type?: string;

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

    public async deposit() {
        let _dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

        try {
            await this.http.post(
                "https://us-central1-lcnem-wallet.cloudfunctions.net/deposit",
                {
                    currency: this.selectedCurrency,
                    amount: this.amount,
                    email: this.global.auth.auth.currentUser!.email,
                    nemAddress: this.global.account!.address.pretty(),
                    type: this.type,
                    lang: this.global.lang
                }
            ).toPromise();
        } catch {
            this.dialog.open(DialogComponent, {
                data: {
                    title: this.translation.error[this.global.lang],
                    content: ""
                }
            });
            return;
        } finally {
            _dialogRef.close();
        }

        this.dialog.open(DialogComponent, {
            data: {
                title: this.translation.completed[this.global.lang],
                content: ""
            }
        }).afterClosed().subscribe(() => {
            this.router.navigate(["/"]);
        });
    }

    public translation = {
        amount: {
            en: "Amount",
            ja: "金額"
        },
        currency: {
            en: "Currency",
            ja: "通貨"
        },
        error: {
            en: "Error",
            ja: "エラー"
        },
        completed: {
            en: "Completed",
            ja: "完了"
        },
        deposit: {
            en: "Deposit",
            ja: "入金"
        },
        mean :{
            en: "Mean",
            ja: "方法"
        },
        bank :{
            en: "Bank",
            ja: "銀行"
        },
        credit: {
            en: "Credit card",
            ja: "クレジットカード"
        }
    } as { [key: string]: { [key: string]: string } };
}
