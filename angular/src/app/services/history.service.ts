import { Injectable } from '@angular/core';
import { Transaction, AccountHttp, Address } from 'nem-library';
import { nodes } from '../models/nodes';
import { WalletsService } from './wallets.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  public transactions?: Transaction[];

  constructor(
    private wallet: WalletsService
  ) {
    wallet.history = this;
  }

  public initialize() {
    this.transactions = undefined;
  }

  public async readTransactions(force?: boolean) {
    if(this.transactions && !force) {
      return;
    }
    if(!this.wallet.currentWallet) {
      return;
    }

    let accountHttp = new AccountHttp(nodes);
    let address = new Address(this.wallet.wallets![this.wallet.currentWallet!].nem);

    let unconfirmedTransactions = await accountHttp.unconfirmedTransactions(address).toPromise();
    let allTransactions = await accountHttp.allTransactions(address, { pageSize: 25 }).toPromise();
    
    this.transactions = unconfirmedTransactions.concat(allTransactions);
  }
}
