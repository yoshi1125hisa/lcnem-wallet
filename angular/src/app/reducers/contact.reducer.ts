import { Action } from '@ngrx/store';
import { Contact } from '../../../../firebase/functions/src/models/contact';


export interface State {
  contacts: {
    [id: string]: Contact
  };
}

export const initialState: State = {
  contacts: {}
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {

    default:
      return state;
  }
}
