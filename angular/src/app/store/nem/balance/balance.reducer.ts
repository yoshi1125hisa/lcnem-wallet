import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Balance } from './balance.model';
import { BalanceActions, BalanceActionTypes } from './balance.actions';

export interface State extends EntityState<Balance> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Balance> = createEntityAdapter<Balance>({
  selectId: entity => entity.id
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: BalanceActions
): State {
  switch (action.type) {
    case BalanceActionTypes.AddBalance: {
      return adapter.addOne(action.payload.balance, state);
    }

    case BalanceActionTypes.UpsertBalance: {
      return adapter.upsertOne(action.payload.balance, state);
    }

    case BalanceActionTypes.AddBalances: {
      return adapter.addMany(action.payload.balances, state);
    }

    case BalanceActionTypes.UpsertBalances: {
      return adapter.upsertMany(action.payload.balances, state);
    }

    case BalanceActionTypes.UpdateBalance: {
      return adapter.updateOne(action.payload.balance, state);
    }

    case BalanceActionTypes.UpdateBalances: {
      return adapter.updateMany(action.payload.balances, state);
    }

    case BalanceActionTypes.DeleteBalance: {
      return adapter.removeOne(action.payload.id, state);
    }

    case BalanceActionTypes.DeleteBalances: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case BalanceActionTypes.LoadBalances: {
      return adapter.addAll(action.payload.balances, state);
    }

    case BalanceActionTypes.ClearBalances: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
