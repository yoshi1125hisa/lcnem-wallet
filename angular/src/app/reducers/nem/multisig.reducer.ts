import { Action } from '@ngrx/store';


export interface State {
  addresses: string[]
}

export const initialState: State = {
  addresses: []
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {

    default:
      return state;
  }
}
