import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { History } from './history.model';
import { HistoryActions, HistoryActionTypes } from './history.actions';

export interface State extends EntityState<History> {
  loading: boolean
}

export const adapter: EntityAdapter<History> = createEntityAdapter<History>({
  selectId: entity => entity.id
});

export const initialState: State = adapter.getInitialState({
  loading: false
});

export function reducer(
  state = initialState,
  action: HistoryActions
): State {
  switch (action.type) {
    case HistoryActionTypes.AddHistory: {
      return adapter.addOne(action.payload.history, state);
    }

    case HistoryActionTypes.UpsertHistory: {
      return adapter.upsertOne(action.payload.history, state);
    }

    case HistoryActionTypes.AddHistorys: {
      return adapter.addMany(action.payload.historys, state);
    }

    case HistoryActionTypes.UpsertHistorys: {
      return adapter.upsertMany(action.payload.historys, state);
    }

    case HistoryActionTypes.UpdateHistory: {
      return adapter.updateOne(action.payload.history, state);
    }

    case HistoryActionTypes.UpdateHistorys: {
      return adapter.updateMany(action.payload.historys, state);
    }

    case HistoryActionTypes.DeleteHistory: {
      return adapter.removeOne(action.payload.id, state);
    }

    case HistoryActionTypes.DeleteHistorys: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case HistoryActionTypes.LoadHistorys: {
      return adapter.addAll(action.payload.historys, state);
    }

    case HistoryActionTypes.ClearHistorys: {
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
