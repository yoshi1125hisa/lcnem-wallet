import { Action } from '@ngrx/store';

export enum AssetDefinitionActionTypes {
  LoadAssetDefinitions = '[AssetDefinition] Load AssetDefinitions',
  
  
}

export class LoadAssetDefinitions implements Action {
  readonly type = AssetDefinitionActionTypes.LoadAssetDefinitions;
}


export type AssetDefinitionActions = LoadAssetDefinitions;
