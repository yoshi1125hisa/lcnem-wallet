import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { nodes } from '../../../classes/nodes';
import { map, mergeMap, catchError, toArray } from 'rxjs/operators';
import { forkJoin, of, from } from 'rxjs';
import { AssetDefinitionActionTypes, AssetDefinitionActions, LoadAssetDefinitionsSuccess, LoadAssetDefinitionsError } from './asset-definition.actions';
import { AssetHttp } from 'nem-library';
import { Store } from '@ngrx/store';
import * as fromAssetDefinition from './asset-definition.reducer';

@Injectable()
export class AssetDefinitionEffects {


  @Effect()
  loadAssetDefinitions$ = this.actions$.pipe(
    ofType(AssetDefinitionActionTypes.LoadAssetDefinitions),
    mergeMap(
      (action) => {
        return this.store.select(state => state.definitions).pipe(
          map(definitions => action.payload.assets.filter(asset => !definitions.find(definition => definition.id.equals(asset.assetId)))),
          map(assets => assets.map(asset => asset.assetId))
        )
      }
    ),
    mergeMap(
      (ids) => {
        const assetHttp = new AssetHttp(nodes);
        return from(ids).pipe(
          mergeMap(id => assetHttp.getAssetDefinition(id)),
          toArray()
        )
      }
    ),
    map(definitions => new LoadAssetDefinitionsSuccess({ definitions: definitions })),
    catchError(error => of(new LoadAssetDefinitionsError({ error: error })))
  );


  constructor(
    private actions$: Actions<AssetDefinitionActions>,
    private store: Store<fromAssetDefinition.State>
  ) { }

}
