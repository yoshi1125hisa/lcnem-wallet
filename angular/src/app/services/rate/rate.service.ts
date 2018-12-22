import { Injectable } from '@angular/core';
import { RxEffectiveStateStore } from 'rx-state-store-js';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class RateService extends RxEffectiveStateStore<State> {

  constructor(
    private firestore: AngularFirestore
  ) {
    super(
      {
        current: "USD",
        usd: 1
      }
    )
  }
  public loadRate() {
    this.firestore.collection("rates").get().subscribe(
      (document) => {
        const state: State = {
          rate: document.data() as Rate
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
  current: string
  xem?: number
  btc?: number
  eht?: number
  jpy?: number
  usd: 1
}