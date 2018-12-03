import { Injectable } from '@angular/core';
import { RxEntityStateService } from 'src/app/classes/rx-entity-state-service';
import { RxEntityState } from 'src/app/classes/rx-entity-state';

@Injectable({
  providedIn: 'root'
})
export class LocalWalletService extends RxEntityStateService<State, string> {

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