import { Injectable } from '@angular/core';
import { RxEffectiveStateStore, RxEffectiveState } from 'rx-state-store-js';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BalanceService extends RxEffectiveStateStore<State> {

  constructor(
    private firestore: AngularFirestore
  ) {
    super(
      {
        loading: false,
        amount: 0,
        custodialLightningAmount: 0
      }
    )
  }

  public loadBalance(address: string, refresh?: boolean) {
  }
}

interface State extends RxEffectiveState {
  amount: number
  custodialLightningAmount: number
  lastAddress?: string
}