
import { AssetDefinitionActions, AssetDefinitionActionTypes } from './asset-definition.actions';
import { AssetDefinition, PublicAccount, XEM } from 'nem-library';

export interface State {
  loading: boolean;
  definitions: AssetDefinition[];
  error?: Error;
}

export const initialState: State = {
  loading: false,
  definitions: [
    {
      creator: new PublicAccount(),
      id: XEM.MOSAICID,
      description: "",
      properties: {
        divisibility: XEM.DIVISIBILITY,
        initialSupply: XEM.INITIALSUPPLY,
        supplyMutable: XEM.SUPPLYMUTABLE,
        transferable: XEM.TRANSFERABLE
      }
    }
  ]
};

export function reducer(
  state = initialState,
  action: AssetDefinitionActions
): State {
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
        definitions: [...action.payload.definitions]
      }
    }

    case AssetDefinitionActionTypes.LoadAssetDefinitionsFailed: {
      return {
        ...state,
        loading: false,
        error: action.error
      }
    }

    default: {
      return state;
    }
  }
}
