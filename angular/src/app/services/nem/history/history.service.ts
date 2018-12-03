import { Injectable } from '@angular/core';
import { RxEffectiveStateService } from 'src/app/classes/rx-effective-state-service';
import { Transaction, Address } from 'nem-library';

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends RxEffectiveStateService<State> {

  constructor() {
    super(
      {
        loading: false,
        transactions: []
      }
    )
  }
}

interface State {
  loading: boolean
  error?: Error
  transactions: Transaction[]
  lastAddress?: Address
}
