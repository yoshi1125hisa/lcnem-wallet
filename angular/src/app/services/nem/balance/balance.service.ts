import { Injectable } from '@angular/core';
import { Asset, Address } from 'nem-library';
import { AsyncReactiveService } from 'src/app/classes/async-reactive-service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService extends AsyncReactiveService<State> {

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