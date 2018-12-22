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
        current: "USD"
      }
    )
  }
  public loadRate(current: string) {
    this.firestore.doc("rates").get().subscribe(
      (document) => {
        const state: State = {
          current: current,
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
  current: string
  rate?: Rate
}