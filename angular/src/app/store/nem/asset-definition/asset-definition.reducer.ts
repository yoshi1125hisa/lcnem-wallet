
import { AssetDefinitionActions, AssetDefinitionActionTypes } from './asset-definition.actions';

export interface State {
  // additional entities state properties
}

export const initialState: State = {
  // additional entity state properties
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
