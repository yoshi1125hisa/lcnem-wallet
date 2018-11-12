import { Action } from '@ngrx/store';
import { Wallet } from '../../../../firebase/functions/src/models/wallet';


export interface State {
  wallets: {
    [id: string]: Wallet
  };
  localWallets: {
    [id: string]: string
  };
}

export const initialState: State = {
  wallets: {},
  localWallets: {}
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {

    default:
      return state;
  }
}
