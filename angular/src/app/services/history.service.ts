import { Injectable } from '@angular/core';
import { Transaction, AccountHttp } from 'nem-library';
import { nodes } from 'src/models/nodes';
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

    let unconfirmedTransactions = await accountHttp.unconfirmedTransactions(this.wallet.currentWallet.address).toPromise();
    let allTransactions = await accountHttp.allTransactions(this.wallet.currentWallet.address).toPromise();
    
    this.transactions = unconfirmedTransactions.concat(allTransactions);
  }
}
