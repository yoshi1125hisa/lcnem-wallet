
import { AssetDefinitionActions, AssetDefinitionActionTypes } from './asset-definition.actions';
import { AssetDefinition, PublicAccount, XEM } from 'nem-library';

export interface State {
  definitions: AssetDefinition[]
}

export const initialState: State = {
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
        ...state
      }
    }

    default: {
      return state;
    }
  }
}
