import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LoadAssetDefinitions, AssetDefinitionActionTypes, LoadAssetDefinitionsFailed, LoadAssetDefinitionsSuccess } from './asset-definition.actions';
import { mergeMap, map, catchError, toArray, merge } from 'rxjs/operators';
import { of, from, forkJoin, concat } from 'rxjs';
import { AssetHttp } from 'nem-library';
import { nodes } from '../../../models/nodes';
import { Store } from '@ngrx/store';
import { State } from '../../../store/index';

@Injectable()
export class AssetDefinitionEffects {

  constructor(
    private actions$: Actions,
    private store: Store<State>
  ) { }

  @Effect() loadAssetDefinitions$ = this.actions$.pipe(
    ofType<LoadAssetDefinitions>(AssetDefinitionActionTypes.LoadAssetDefinitions),
    mergeMap(
      (action) => {
        return of(new AssetHttp(nodes)).pipe(
          mergeMap(
            (assetHttp) => {
              return of(action.payload.assetIds).pipe(
                mergeMap(
                  (assetIds) => {
                    return this.store.select(state => state.nemAssetDefinition.definitions).pipe(
                      map(
                        (definitions) => {
                          return assetIds.filter(
                            (assetId) => {
                              return !definitions.find(
                                (definition) => {
                                  return definition.id.equals(assetId);
                                }
                              )
                            }
                          );
                        }
                      )
                    );
                  }
                ),
                mergeMap(
                  (assetId) => {
                    return from(assetId).pipe(
                      mergeMap(
                        (assetId) => {
                          return assetHttp.getAssetDefinition(assetId);
                        }
                      )
                    );
                  }
                )
              );
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
