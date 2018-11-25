import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LoadAssetDefinitions, AssetDefinitionActionTypes, LoadAssetDefinitionsFailed, LoadAssetDefinitionsSuccess } from './asset-definition.actions';
import { mergeMap, map, catchError, toArray, merge } from 'rxjs/operators';
import { of, from, forkJoin, concat } from 'rxjs';
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
              return from(action.payload.assetIds).pipe(
                mergeMap(assetId => assetHttp.getAssetDefinition(assetId))
              )
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
  );
}
