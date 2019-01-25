import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { RxEffectiveStateStore } from 'rx-state-store-js';
import * as bitcoin from 'bitcoinjs-lib'

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

  public loadHistories(address: string, refresh?: boolean) {
    if (this.state.lastAddress === address && !refresh) {
      return;
    }
    this.streamLoadingState()

    forkJoin(
      //
    ).pipe(
      //
    ).subscribe(
      (transactions) => {
        const state: State = {
          ...this.state,
          loading: false,
          transactions: transactions,
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
  transactions: bitcoin.Transaction[]
  lastAddress?: string
}
