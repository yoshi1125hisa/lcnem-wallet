import { LocalWalletActions, LocalWalletActionTypes } from './local-wallet.actions';

export interface State {
  // additional entities state properties
}

export const initialState: State = {
  // additional entity state properties
};

export function reducer(
  state = initialState,
  action: LocalWalletActions
): State {
  switch (action.type) {
    

    default: {
      return state;
    }
  }
}
