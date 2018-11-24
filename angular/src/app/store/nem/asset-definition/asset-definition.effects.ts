import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LoadAssetDefinitions, AssetDefinitionActionTypes, LoadAssetDefinitionsFailed, LoadAssetDefinitionsSuccess } from './asset-definition.actions';
import { mergeMap, map, catchError, toArray } from 'rxjs/operators';
import { of, from, forkJoin } from 'rxjs';
import { AssetHttp } from 'nem-library';
import { nodes } from '../../../models/nodes';


@Injectable()
export class AssetDefinitionEffects {

  constructor(private actions$: Actions) { }

  @Effect() loadAssetDefinitions$ = this.actions$.pipe(
    ofType<LoadAssetDefinitions>(AssetDefinitionActionTypes.LoadAssetDefinitions),
    mergeMap(
      (action) => {
        return of(new AssetHttp(nodes)).pipe(
          mergeMap(
            (assetHttp) => {
              return action.payload.assetIds.map(assetId => assetHttp.getAssetDefinition(assetId))
            }
          ),
          toArray(),
          map(
            (definitions) => {
              return new LoadAssetDefinitionsSuccess({ definitions: definitions })
            }
          ),
          catchError(
            (e) => {
              return of(new LoadAssetDefinitionsFailed(e))
            }
          )
        )
      }
    )
  )
}
