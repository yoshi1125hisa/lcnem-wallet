import { Injectable } from '@angular/core';
import { RxEffectiveStateStore } from 'rx-state-store-js';
import { AssetDefinition, AssetId, AssetHttp, Address, PublicAccount, XEM } from 'nem-library';
import { nodes } from '../../../classes/nodes';
import { from, of } from 'rxjs';
import { mergeMap, toArray, map, filter, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssetDefinitionService extends RxEffectiveStateStore<State> {

  constructor() {
    super(
      {
        loading: false,
        definitions: [
          new AssetDefinition(
            new PublicAccount(),
            XEM.MOSAICID,
            "",
            {
              initialSupply: XEM.INITIALSUPPLY,
              supplyMutable: XEM.SUPPLYMUTABLE,
              transferable: XEM.TRANSFERABLE,
              divisibility: XEM.DIVISIBILITY
            }
          )
        ]
      }
    )
  }

  public loadAssetDefinitions(ids: AssetId[]) {
    const unloadedId = ids.filter(id => !this.state.definitions.find(definition => definition.id.equals(id)))
    if(!unloadedId.length) {
      return;
    }

    this.streamLoadingState()

    const assetHttp = new AssetHttp(nodes);
    from(unloadedId).pipe(
      mergeMap(id => assetHttp.getAssetDefinition(id)),
      toArray()
    ).subscribe(
      (definitions) => {
        const state: State = {
          loading: false,
          definitions: this.state.definitions.concat(definitions)
        }

        this.streamState(state)
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
