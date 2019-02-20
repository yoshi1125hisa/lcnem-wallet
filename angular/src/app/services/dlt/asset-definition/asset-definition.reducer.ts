import { Action } from '@ngrx/store';
import { AssetDefinition, PublicAccount, XEM } from 'nem-library';
import { AssetDefinitionActions, AssetDefinitionActionTypes } from './asset-definition.actions';


export interface State {
  loading: boolean
  error?: Error
  definitions: AssetDefinition[]
}

export const initialState: State = {
  loading: true,
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
};

export function reducer(state = initialState, action: AssetDefinitionActions): State {
  switch (action.type) {
    case AssetDefinitionActionTypes.LoadAssetDefinitions: {
      return {
        ...state,
        loading: true
      }
    }
    case AssetDefinitionActionTypes.LoadAssetDefinitionsSuccess: {
      return {
        ...state,
        loading: false,
        definitions: state.definitions.concat(action.payload.definitions)
      }
    }
    case AssetDefinitionActionTypes.LoadAssetDefinitionsError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }
    default: {
      return state;
    }
  }
}
