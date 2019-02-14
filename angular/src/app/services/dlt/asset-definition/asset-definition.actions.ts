import { Action } from '@ngrx/store';
import { Asset, AssetDefinition } from 'nem-library';

export enum AssetDefinitionActionTypes {
  LoadAssetDefinitions = 'LoadAssetDefinitions',
  LoadAssetDefinitionsSuccess = 'LoadAssetDefinitionsSuccess',
  LoadAssetDefinitionsError = 'LoadAssetDefinitionsError'
}

export class LoadAssetDefinitions implements Action {
  readonly type = AssetDefinitionActionTypes.LoadAssetDefinitions;

  constructor(public payload: { assets: Asset[] }) {}
}

export class LoadAssetDefinitionsSuccess implements Action {
  readonly type = AssetDefinitionActionTypes.LoadAssetDefinitionsSuccess;

  constructor(public payload: { definitions: AssetDefinition[] }) {}
}

export class LoadAssetDefinitionsError implements Action {
  readonly type = AssetDefinitionActionTypes.LoadAssetDefinitionsError;

  constructor(public payload: { error: Error }) {}
}


export type AssetDefinitionActions = LoadAssetDefinitions | LoadAssetDefinitionsSuccess | LoadAssetDefinitionsError;