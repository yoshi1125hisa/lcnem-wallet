import { Injectable } from '@angular/core';
import { EntityReactiveService } from 'src/app/classes/entity-reactive-service';
import { EntityReactiveState } from 'src/app/classes/entity-reactive-state';

@Injectable({
  providedIn: 'root'
})
export class LocalWalletService extends EntityReactiveService<State, string> {

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

interface State extends EntityReactiveState<string> {

}