import { Action } from '@ngrx/store';
import { Asset, AssetDefinition } from 'nem-library';


export interface State {
  assets: Asset[];
  definitions: {
    [id: string]: AssetDefinition
  };
}

export const initialState: State = {
  assets: [],
  definitions: {}
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {

    default:
      return state;
  }
}
