import { Injectable } from '@angular/core';
import { AsyncReactiveService } from 'src/app/classes/async-reactive-service';
import { Transaction, Address } from 'nem-library';

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends AsyncReactiveService<State> {

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
