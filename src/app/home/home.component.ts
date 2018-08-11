import { Component, OnInit, ViewChild, trigger } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataService } from '../services/global-data.service';
import { Invoice } from '../../models/invoice';
import { nodes } from '../../models/nodes';
import { ServerConfig, AccountHttp, MosaicHttp, TransactionHttp, NamespaceHttp } from 'nem-library';
import { MatSidenav, MatMenuTrigger, MatMenu, MatMenuModule } from '../../../node_modules/@angular/material';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../components/dialog/dialog.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public loading = true;
    public qrUrl = "";
    public nodes = nodes;

    @ViewChild("sidenav")
    public sidenav?: MatSidenav;

    watcher?: Subscription;

    constructor(
        public global: GlobalDataService,
        private router: Router,
        private media: ObservableMedia,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.watcher = this.media.subscribe((change: MediaChange) => {
            if(!this.sidenav) {
                return;
            }
            if (change.mqAlias == "xs" || change.mqAlias == "sm") {
                this.sidenav.mode = "over";
                this.sidenav.opened = false;
            } else {
                this.sidenav.mode = "side";
                this.sidenav.opened = true;
            }
        });

        this.global.auth.authState.subscribe((user) => {
            if (user == null) {
                this.router.navigate(["/accounts/login"]);
                return;
            }
            this.global.initialize().then(() => {
                let invoice = new Invoice();
                invoice.data.addr = this.global.account!.address.plain();
                this.qrUrl = "https://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=" + invoice.generate();
                this.loading = false;
            });
        });
    }

    ngOnDestroy() {
        this.watcher!.unsubscribe();
    }

    public async logout() {
        await this.global.logout();
        this.dialog.open(DialogComponent, {
          data: {
              title: this.translation.completed[this.global.lang],
              content: ""
          }
        }).afterClosed().subscribe(() => {
            this.router.navigate(["/accounts/login"]);
        });
    }

    public async refresh() {
        this.loading = true;

        await this.global.refresh();

        this.loading = false;
    }

    public translation = {
        balance: {
            en: "Balance",
            ja: "残高"
        },
        deposit: {
            en: "Deposit",
            ja: "入金"
        },
        history: {
            en: "History",
            ja: "履歴"
        },
        language: {
            en: "Language",
            ja: "言語"
        },
        logout: {
            en: "Log out",
            ja: "ログアウト"
        },
        scan: {
            en: "Scan QR-code",
            ja: "QRコードをスキャン"
        },
        withdraw: {
            en: "Withdraw",
            ja: "出金"
        },
        yourAddress: {
            en: "Your address",
            ja: "あなたのアドレス"
        },
        terms: {
          en: "Terms of Service",
          ja: "利用規約"
        },
        completed: {
          en: "Successfully logged out",
          ja: "正常にログアウトしました。"
        }
    } as {[key: string]: {[key: string]: string}};
}
