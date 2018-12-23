import { Injectable } from '@angular/core';
import { RxEffectiveStateStore, RxEffectiveState } from 'rx-state-store-js';
import { AngularFirestore } from '@angular/fire/firestore';
import { Rate } from '../../../../../firebase/functions/src/models/rate'


@Injectable({
  providedIn: 'root'
})
export class RateService extends RxEffectiveStateStore<State> {

  constructor(
    private firestore: AngularFirestore
  ) {
    super(
      {
        loading: false,
        rate: {
          currency: "USD",
          xem: 1,
          btc: 1,
          eth: 1,
          jpy: 1,
          usd: 1
        }
      }
    )
  }

  public loadRate() {
    this.firestore.doc("rates").get().subscribe(
      (document) => {
        const state: State = {
          loading: false,
          rate: document.data() as Rate
        }
        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      })
  }
}


interface State extends RxEffectiveState {
  currency?: string
  rate: Rate
}