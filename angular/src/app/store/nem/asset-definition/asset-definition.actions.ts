import { Action } from '@ngrx/store';
import { AssetId, AssetDefinition } from 'nem-library';

export enum AssetDefinitionActionTypes {
  LoadAssetDefinitions = '[AssetDefinition] Load AssetDefinitions',
  LoadAssetDefinitionsSuccess = '[AssetDefinition] Load AssetDefinitions Success',
  LoadAssetDefinitionsFailed = '[AssetDefinition] Load AssetDefinitions Failed'
}

export class LoadAssetDefinitions implements Action {
  readonly type = AssetDefinitionActionTypes.LoadAssetDefinitions;

  constructor(
    public payload: {
      assetIds: AssetId[]
    }
  ) { }
}

export class LoadAssetDefinitionsSuccess implements Action {
  readonly type = AssetDefinitionActionTypes.LoadAssetDefinitionsSuccess;

  constructor(
    public payload: {
      definitions: AssetDefinition[]
    }
  ) { }
}

export class LoadAssetDefinitionsFailed implements Action {
  readonly type = AssetDefinitionActionTypes.LoadAssetDefinitionsFailed;

  constructor(
    public error: Error
  ) { }
}

export type AssetDefinitionActions =
  LoadAssetDefinitions
  | LoadAssetDefinitionsSuccess
  | LoadAssetDefinitionsFailed;