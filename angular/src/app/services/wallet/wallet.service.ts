import { Injectable } from '@angular/core';
import { EntityReactiveService } from 'src/app/classes/entity-reactive-service';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService extends EntityReactiveService<State, Wallet> {

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
