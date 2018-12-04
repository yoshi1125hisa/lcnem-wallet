import { Injectable } from '@angular/core';
import { RxEntityStateStore } from 'src/app/classes/rx-entity-state-store';
import { RxEntityState } from 'src/app/classes/rx-entity-state';

@Injectable({
  providedIn: 'root'
})
export class LocalWalletService extends RxEntityStateStore<State, string> {
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

interface State extends RxEntityState<string> {

}