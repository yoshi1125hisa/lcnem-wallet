import { Injectable } from '@angular/core';
import { Transaction, AccountHttp, Address } from 'nem-library';
import { nodes } from '../../models/nodes';
import { WalletsService } from './wallets.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  public transactions?: Transaction[];

  constructor(
    private wallet: WalletsService
  ) { }

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
    let allTransactions = await accountHttp.allTransactions(address).toPromise();
    
    this.transactions = unconfirmedTransactions.concat(allTransactions);
  }
}
