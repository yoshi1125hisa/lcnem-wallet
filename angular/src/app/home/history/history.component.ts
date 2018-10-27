import { Component, OnInit } from '@angular/core';
import { Transaction } from 'nem-library';
import { lang } from '../../../models/lang';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public loading = true;
  get lang() { return lang; }

  public transactions?: Transaction[];

  constructor(
    private history: HistoryService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  public async refresh(force?: boolean) {
    this.loading = true;
    
    await this.history.readTransactions(force);
    this.transactions = this.history.transactions;

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
