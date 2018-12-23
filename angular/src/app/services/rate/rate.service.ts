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
        currency: "USD",
        rate: {} as Rate
      }
    )
  }

  public loadRate(currency: string) {
    this.firestore.doc("rates").get().subscribe(
      (document) => {
        const state: State = {
          loading: false,
          currency: currency,
          rate: document.data() as Rate
        }
        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      })
  }

  public changeCurrency(currency: string) {
    const state: State = {
      loading: false,
      currency: currency,
      ...this._state
    }
    this.streamState(state)
  }
}


interface State extends RxEffectiveState {
  currency: string
  rate: Rate
}