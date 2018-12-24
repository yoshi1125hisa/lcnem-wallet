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
        base: "USD",
        rate: {} as Rate
      }
    )
  }

  public loadRate(base: string) {
    this.firestore.doc("rates").get().subscribe(
      (document) => {
        const state: State = {
          loading: false,
          base: base,
          rate: document.data() as Rate
        }
        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      })
  }

  public changeCurrency(base: string) {
    const state: State = {
      loading: false,
      base: base,
      ...this._state
    }
    this.streamState(state)
  }
}


interface State extends RxEffectiveState {
  base: string
  rate: Rate
}