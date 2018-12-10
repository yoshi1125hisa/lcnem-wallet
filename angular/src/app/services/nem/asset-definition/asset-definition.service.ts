import { Injectable } from '@angular/core';
import { RxEffectiveStateStore } from 'rx-state-store-js';
import { AssetDefinition, AssetId, AssetHttp, Address } from 'nem-library';
import { nodes } from '../../../classes/nodes';
import { from } from 'rxjs';
import { mergeMap, toArray, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssetDefinitionService extends RxEffectiveStateStore<State> {

  constructor() {
    super(
      {
        loading: false,
        definitions: []
      }
    )
  }

  public loadAssetDefinitions(ids: AssetId[]) {
    const filteredId = ids.filter(id => this._state.definitions.find(definition => definition.id.equals(id)))
    if(!filteredId.length) {
      return;
    }

    this.streamLoadingState();

    const assetHttp = new AssetHttp(nodes);
    from(filteredId).pipe(
      mergeMap(id => assetHttp.getAssetDefinition(id)),
      toArray()
    ).subscribe(
      (definitions) => {
        const state: State = {
          ...this._state,
          loading: false,
          definitions: definitions
        }
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
    
  }
}

interface State {
  loading: boolean
  error?: Error
  definitions: AssetDefinition[]
}
