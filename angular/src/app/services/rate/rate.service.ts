import { Injectable } from '@angular/core';
import { RxEffectiveStateStore } from 'rx-state-store-js';

@Injectable({
  providedIn: 'root'
})
export class RateService extends RxEffectiveStateStore<State> {

  constructor() {
    super(
      {
        current: "USD",
        usd: 1
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