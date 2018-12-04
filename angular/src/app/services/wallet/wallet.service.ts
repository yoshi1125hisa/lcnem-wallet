import { Injectable } from '@angular/core';
import { RxEntityStateStore } from 'src/app/classes/rx-entity-state-store';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService extends RxEntityStateStore<State, Wallet> {
  constructor() {
    super(
      {
        loading: false,
        ids: [],
        entities: {}
      }
    )
  }
}

interface State {
  loading: boolean
  error?: Error
  ids: string[]
  entities: { [id: string]: Wallet }
  currentWalletId?: string
}
