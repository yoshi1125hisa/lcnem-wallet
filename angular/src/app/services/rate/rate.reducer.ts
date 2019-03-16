import { Action } from '@ngrx/store';
import { Rate } from '../../../../../firebase/functions/src/models/rate';
import { RateActionTypes, RateActions } from './rate.actions';


export interface State {
  loading: boolean;
  error?: Error;
  currency: string;
  rate: Rate;
  lastLoading?: Date;
}

export const initialState: State = {
  loading: true,
  currency: 'USD',
  rate: {} as Rate
};

export function reducer(state = initialState, action: RateActions): State {
  switch (action.type) {
    case RateActionTypes.LoadRates: {
      const beforeNow = new Date();
      beforeNow.setHours(beforeNow.getHours() - 12);
      if (state.lastLoading && state.lastLoading <= beforeNow && !action.payload.refresh) {
        return state;
      }
      return {
        ...state,
        loading: true,
        lastLoading: new Date()
      };
    }
    case RateActionTypes.LoadRatesSuccess: {
      return {
        ...state,
        loading: false,
        rate: action.payload.rate
      };
    }
    case RateActionTypes.LoadRatesError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    }
    case RateActionTypes.ChangeCurrency: {
      return {
        ...state,
        currency: action.payload.currency
      };
    }
    default: {
      return state;
    }
  }
}
