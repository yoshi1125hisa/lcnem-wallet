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
        loading: true,
        currency: "USD",
        rate: {} as Rate
      }
    )
  }

  public loadRate(refresh?: boolean) {
    if (this.state.lastLoading && (new Date()).valueOf() == this.state.lastLoading!.valueOf() && !refresh) {
      return
    }
    
    this.firestore.collection("rates").get().subscribe(
      (document) => {
        const state: State = {
          loading: false,
          currency: this._state.currency,
          rate: document.docs[0].data() as Rate,
          lastLoading: new Date()
        }
        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public changeCurrency(currency: string) {
    this.streamLoadingState()
    const state: State = {
      loading: false,
      currency: currency,
      rate: this._state.rate
    }
    this.streamState(state)
  }
}


interface State {
  loading: boolean
  currency: string
  rate: Rate
  lastLoading?: Date
}