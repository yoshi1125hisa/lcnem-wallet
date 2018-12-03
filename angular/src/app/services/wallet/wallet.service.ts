import { Injectable } from '@angular/core';
import { RxEntityStateService } from 'src/app/classes/rx-entity-state-service';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService extends RxEntityStateService<State, Wallet> {

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
