import { Injectable } from '@angular/core';
import { RxEffectiveStateStore } from 'rx-state-store-js';
import { AngularFirestore } from '@angular/fire/firestore';
import { Rate } from '../../../../../firebase/functions/src/models/rate';

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
        currency: 'USD',
        rate: {} as Rate
      }
    )
  }

  public loadRate() {
    this.firestore.collection("rates").get().subscribe(
      (document) => {
        const state: State = {
          loading: false,
          currency: this._state.currency,
          rate: document.docs[0].data() as Rate
        }
        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public changeCurrency(currency: string) {
    this.streamState(
      {
        loading: false,
        currency: currency,
        ...this._state
      }
    )
    this.streamLoadingState()
  }
}


interface State {
  loading: boolean
  currency: string
  rate: Rate
}