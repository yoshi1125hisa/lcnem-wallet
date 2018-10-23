import { Component, OnInit } from '@angular/core';
import { Transaction } from 'nem-library';
import { Router } from '@angular/router';
import { GlobalDataService } from '../../services/global-data.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public loading = true;
  public progress = 0;

  public transactions?: Transaction[];

  constructor(
    public global: GlobalDataService,
    private router: Router,
    private auth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.auth.authState.subscribe(async (user) => {
      if (user == null) {
        this.router.navigate(["accounts", "login"]);
        return;
      }
      await this.refresh();
    });
  }

  public async refresh() {
    this.progress = 0;
    this.loading = true;
    this.progress = 10;
    await this.global.refreshWallet();
    this.progress = 40;
    let currentWallet = this.global.account.currentWallet!;
    this.progress = 50;
    let unconfirmedTransactions = await this.global.accountHttp.unconfirmedTransactions(currentWallet.wallet.address).toPromise();
    this.progress = 70;
    let allTransactions = await this.global.accountHttp.allTransactions(currentWallet.wallet.address).toPromise();
    this.progress = 90;
    this.transactions = unconfirmedTransactions.concat(allTransactions);
    this.progress = 100;
    this.loading = false;
  }

  public translation = {
    history: {
      en: "History",
      ja: "履歴"
    } as any,
    incoming: {
      en: "Incoming",
      ja: "受信"
    } as any,
    outgoing: {
      en: "Outgoing",
      ja: "送信"
    } as any,
    noTransaction: {
      en: "There is no transaction.",
      ja: "取引はありません。"
    } as any
  };
}
