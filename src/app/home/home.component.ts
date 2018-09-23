import { Component, OnInit, ViewChild, trigger } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataService } from '../services/global-data.service';
import { Invoice } from '../../models/invoice';
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


  constructor(
    public global: GlobalDataService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
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

  copyMessage(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
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
    },
    copy: {
      en: "Copy this Address",
      ja: "アドレスをコピーする"
    },
    contacts: {
      en: "Address book",
      ja: "アドレス帳"
    }
  } as { [key: string]: { [key: string]: string } };
}
