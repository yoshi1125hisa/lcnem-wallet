import { BalanceActions, BalanceActionTypes } from './balance.actions';
import { Asset } from 'nem-library';

export interface State {
  assets: Asset[];
  loading: boolean;
  error?: Error
}

export const initialState: State = {
  assets: [],
  loading: false
};

export function reducer(
  state = initialState,
  action: BalanceActions
): State {
  switch (action.type) {
    case BalanceActionTypes.LoadBalances: {
      return {
        ...state,
        loading: true
      }
    }

    case BalanceActionTypes.LoadBalancesSuccess: {
      return {
        ...state,
        loading: false
      }
    }

    case BalanceActionTypes.LoadBalancesFailed: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }

    default: {
      return state;
    }
  }
}
