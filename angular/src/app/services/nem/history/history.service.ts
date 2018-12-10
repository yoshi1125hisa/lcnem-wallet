import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction, Address, AccountHttp } from 'nem-library';
import { RxEffectiveStateStore } from 'rx-state-store-js';
import { nodes } from '../../../classes/nodes';

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends RxEffectiveStateStore<State> {

  constructor() {
    super(
      {
        loading: false,
        transactions: []
      }
    )
  }

  public loadHistories(address: Address, refresh?: boolean) {
    if(this._state.lastAddress && address.equals(this._state.lastAddress) && !refresh) {
      return;
    }
    this.streamLoadingState()

    const accountHttp = new AccountHttp(nodes);
    forkJoin(
      accountHttp.unconfirmedTransactions(address),
      accountHttp.allTransactions(address)
    ).pipe(
      map(fork => fork[0].concat(fork[1])),
    ).subscribe(
      (transactions) => {
        const state = {
          ...this._state,
          loading: false,
          assets: transactions,
          lastAddress: address
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }
}

interface State {
  loading: boolean
  error?: Error
  transactions: Transaction[]
  lastAddress?: Address
}
