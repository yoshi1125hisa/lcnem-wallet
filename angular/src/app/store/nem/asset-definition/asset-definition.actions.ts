import { Action } from '@ngrx/store';
import { AssetId } from 'nem-library';

export enum AssetDefinitionActionTypes {
  LoadAssetDefinitions = '[AssetDefinition] Load AssetDefinitions'
}

export class LoadAssetDefinitions implements Action {
  readonly type = AssetDefinitionActionTypes.LoadAssetDefinitions;

  constructor(
    public payload: {
      assetIds: AssetId[]
    }
  ) {}
}

export type AssetDefinitionActions =
 LoadAssetDefinitions;