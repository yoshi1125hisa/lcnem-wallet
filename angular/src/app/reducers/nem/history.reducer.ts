import { Action } from '@ngrx/store';
import { Transaction } from 'nem-library';


export interface State {
  transactions: Transaction[]
}

export const initialState: State = {
  transactions: []
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {

    default:
      return state;
  }
}
