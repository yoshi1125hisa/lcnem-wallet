import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../services/global-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { HttpClient } from '@angular/common/http';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare let Stripe: any;

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
    public supportedCurrencies = [
        "JPY"
    ];
    public selectedCurrency = "JPY";

    public amount?: number;
    public fee: { [key: string]: number } = {
        "JPY": 100
    };

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
        if (!(window as any).PaymentRequest) {
            this.dialog.open(DialogComponent, {
                data: {
                    title: this.translation.error[this.global.lang],
                    content: ""
                }
            });
            return;
        }
        let supportedInstruments: PaymentMethodData[] = [{
            supportedMethods: ['basic-card'],
            data: {
                supportedNetworks: [
                    'visa',
                    'mastercard',
                    'amex',
                    'diners',
                    'jcb'
                ]
            }
        }];

        let details = {
            displayItems: [
                {
                    label: this.translation.deposit[this.global.lang],
                    amount: {
                        currency: this.selectedCurrency,
                        value: this.amount!.toString()
                    }
                },
                {
                    label: this.translation.fee[this.global.lang],
                    amount: {
                        currency: this.selectedCurrency,
                        value: this.fee[this.selectedCurrency].toString()
                    }
                }
            ],
            total: {
                label: this.translation.total[this.global.lang],
                amount: {
                    currency: this.selectedCurrency,
                    value: (Number(this.amount) + this.fee[this.selectedCurrency]).toString()
                }
            }
        };

        let request = new PaymentRequest(supportedInstruments, details, { requestShipping: false });

        let result = await request.show();
        if(!result) {
            return;
        }

        let dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

        Stripe.setPublishableKey("pk_live_uhG5YU8PUcilEs4oIAAnGciP");
        Stripe.card.createToken({
            number: result.details.cardNumber,
            cvc: result.details.cardSecurityCode,
            exp_month: result.details.expiryMonth,
            exp_year: result.details.expiryYear
        }, async (status: any, response: any) => {
            try {
                if (status == 200) {
                    await this.http.post(
                        "https://us-central1-lcnem-wallet.cloudfunctions.net/charge",
                        {
                            currency: this.selectedCurrency,
                            amount: details.total.amount.value,
                            email: this.global.auth.auth.currentUser!.email,
                            nemAddress: this.global.account!.address.pretty(),
                            token: response.id
                        }
                    ).toPromise();
                } else {
                    throw Error();
                }
            } catch {
                this.dialog.open(DialogComponent, {
                    data: {
                        title: this.translation.error[this.global.lang],
                        content: ""
                    }
                });
                result.complete("fail");

                return;
            } finally {
                result.complete("success");
                dialogRef.close();
            }
    
            this.dialog.open(DialogComponent, {
                data: {
                    title: this.translation.completed[this.global.lang],
                    content: ""
                }
            }).afterClosed().subscribe(() => {
                this.router.navigate([""]);
            });
            
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
        completedMessage: {
            en: "Please wait a moment until the multi-signature transaction will be confirmed.",
            ja: "マルチシグトランザクションが承認されるまで少々お待ちください。"
        },
        deposit: {
            en: "Deposit",
            ja: "入金"
        },
        unsupported: {
            en: "Request Payment API is not supported in this browser.",
            ja: "Request Payment APIがこのブラウザではサポートされていません。"
        },
        fee: {
            en: "Fee",
            ja: "手数料"
        },
        total: {
            en: "Total",
            ja: "合計"
        }
    } as { [key: string]: { [key: string]: string } };
}
