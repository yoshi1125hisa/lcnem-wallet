import { Action } from '@ngrx/store';
import { Address, Asset } from 'nem-library';
import { BalanceActionTypes, BalanceActions } from './balance.actions';


export interface State {
  loading: boolean
  error?: Error
  assets: Asset[]
  lastAddress?: Address
}

export const initialState: State = {
  loading: true,
  assets: []
};

export function reducer(state = initialState, action: BalanceActions): State {
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
        loading: false,
        assets: action.payload.assets,
        lastAddress: action.payload.address
      }
    }
    case BalanceActionTypes.LoadBalancesError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }
    default:
      return state;
  }
}
