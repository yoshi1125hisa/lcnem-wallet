import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Multisig } from './multisig.model';
import { MultisigActions, MultisigActionTypes } from './multisig.actions';

export interface State extends EntityState<Multisig> {
  loading: boolean
}

export const adapter: EntityAdapter<Multisig> = createEntityAdapter<Multisig>();

export const initialState: State = adapter.getInitialState({
  loading: false
});

export function reducer(
  state = initialState,
  action: MultisigActions
): State {
  switch (action.type) {
    case MultisigActionTypes.AddMultisig: {
      return adapter.addOne(action.payload.multisig, state);
    }

    case MultisigActionTypes.UpsertMultisig: {
      return adapter.upsertOne(action.payload.multisig, state);
    }

    case MultisigActionTypes.AddMultisigs: {
      return adapter.addMany(action.payload.multisigs, state);
    }

    case MultisigActionTypes.UpsertMultisigs: {
      return adapter.upsertMany(action.payload.multisigs, state);
    }

    case MultisigActionTypes.UpdateMultisig: {
      return adapter.updateOne(action.payload.multisig, state);
    }

    case MultisigActionTypes.UpdateMultisigs: {
      return adapter.updateMany(action.payload.multisigs, state);
    }

    case MultisigActionTypes.DeleteMultisig: {
      return adapter.removeOne(action.payload.id, state);
    }

    case MultisigActionTypes.DeleteMultisigs: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case MultisigActionTypes.LoadMultisigs: {
      return adapter.addAll(action.payload.multisigs, state);
    }

    case MultisigActionTypes.ClearMultisigs: {
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
