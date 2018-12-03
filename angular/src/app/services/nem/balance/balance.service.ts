import { Injectable } from '@angular/core';
import { Asset, Address } from 'nem-library';
import { RxEffectiveStateService } from 'src/app/classes/rx-effective-state-service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService extends RxEffectiveStateService<State> {

  constructor() {
    super(
      {
        loading: false,
        assets: []
      }
    )
  }
}

interface State {
  loading: boolean
  error?: Error
  assets: Asset[]
  lastAddress?: Address
}