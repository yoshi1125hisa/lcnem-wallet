import { Action } from '@ngrx/store';


export interface State {
  twoLetter: string;
}

export const initialState: State = {
  twoLetter: window.navigator.language.substr(0, 2) == "ja" ? "ja" : "en"
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {

    default:
      return state;
  }
}
