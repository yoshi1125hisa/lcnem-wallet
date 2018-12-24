import { Injectable } from '@angular/core';
import { RxEffectiveStateStore, RxEffectiveState } from 'rx-state-store-js';
import { AngularFirestore } from '@angular/fire/firestore';
import { Rate } from '../../../../../firebase/functions/src/models/rate'
import { map, first } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { Key } from 'protractor';


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

  public loadRate() {


    const state: State = {
      loading: false,
      currency: this._state.currency,
      rate: {}
    }

    this.firestore.collection("rates").get()
      .subscribe(
        (document) => {
          for (const doc of document.docs) {

          }
        }
      )



  }

  public changeCurrency(currency: string) {
    const state: State = {
      loading: false,
      currency: currency,
      ...this._state
    }
    this.streamState(state)
    this.loadRate()
  }
}


interface State extends RxEffectiveState {
  currency: string
  rate: Rate
}