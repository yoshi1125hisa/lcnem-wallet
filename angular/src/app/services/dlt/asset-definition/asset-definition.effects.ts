import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { nodes } from '../../../classes/nodes';
import { map, mergeMap, catchError, toArray, first, concatMap, filter } from 'rxjs/operators';
import { forkJoin, of, from } from 'rxjs';
import { AssetDefinitionActionTypes, AssetDefinitionActions, LoadAssetDefinitionsSuccess, LoadAssetDefinitionsError } from './asset-definition.actions';
import { AssetHttp } from 'nem-library';
import { Store } from '@ngrx/store';
import { State } from '../../reducer';
import { Tuple } from '../../../classes/tuple';

@Injectable()
export class AssetDefinitionEffects {


  @Effect()
  loadAssetDefinitions$ = this.actions$.pipe(
    ofType(AssetDefinitionActionTypes.LoadAssetDefinitions),
    map(action => action.payload),
    concatMap(payload => this.assetDefinition$.pipe(
      first(),
      map(state => Tuple(payload, state)),
    )),
    map(([payload, state]) => payload.assets.filter(asset => !state.definitions.find(definition => definition.id.equals(asset)))),
    filter((ids => ids.length > 0)),
    map(ids => Tuple(ids, new AssetHttp(nodes))),
    concatMap(([ids, assetHttp]) => forkJoin(ids.map(id => assetHttp.getAssetDefinition(id)))),
    map(definitions => new LoadAssetDefinitionsSuccess({ definitions: definitions })),
    catchError(error => of(new LoadAssetDefinitionsError({ error: error })))
  );

  public assetDefinition$ = this.store.select(state => state.assetDefinition)

  constructor(
    private actions$: Actions<AssetDefinitionActions>,
    private store: Store<State>
  ) { }

}
