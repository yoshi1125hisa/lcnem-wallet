import { Component, OnInit } from '@angular/core';
import { Transaction } from 'nem-library';
import { Router } from '@angular/router';
import { GlobalDataService } from '../../services/global-data.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public loading = true;

  public transactions?: Transaction[];

  constructor(
    public global: GlobalDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.global.auth.authState.subscribe((user) => {
      if (user == null) {
        this.router.navigate(["/accounts/login"]);
        return;
      }
      this.global.initialize().then(() => {
        this.refresh();
      });
    });
  }

  public async refresh() {
    this.loading = true;

    let unconfirmedTransactions = await this.global.accountHttp.unconfirmedTransactions(this.global.account!.address).toPromise();
    let allTransactions = await this.global.accountHttp.allTransactions(this.global.account!.address).toPromise();
    this.transactions = unconfirmedTransactions.concat(allTransactions);

    this.loading = false;
  }

  public translation = {
    history: {
      en: "History",
      ja: "履歴"
    },
    incoming: {
      en: "Incoming",
      ja: "受信"
    },
    outgoing: {
      en: "Outgoing",
      ja: "送信"
    },
    noTransaction: {
      en: "There is no transaction.",
      ja: "取引はありません。"
    }
  } as { [key: string]: { [key: string]: string } };
}
