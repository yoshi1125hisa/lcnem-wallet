import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Contact } from './contact.model';
import { ContactActions, ContactActionTypes } from './contact.actions';

export interface State extends EntityState<Contact> {
  loading: boolean;
  error?: Error;
}

export const adapter: EntityAdapter<Contact> = createEntityAdapter<Contact>();

export const initialState: State = adapter.getInitialState({
  loading: false
});

export function reducer(
  state = initialState,
  action: ContactActions
): State {
  switch (action.type) {
    case ContactActionTypes.LoadContacts: {
      return {
        ...state,
        loading: true
      }
    }

    case ContactActionTypes.LoadContactsSuccess: {
      return {
        ...state,
        loading: false
      }
    }

    case ContactActionTypes.LoadContactsFailed: {
      return {
        ...state,
        loading: false
      }
    }

    case ContactActionTypes.AddContact: {
      return {
        ...state,
        loading: true
      }
    }

    case ContactActionTypes.AddContactSuccess: {
      const entities = { ...state.entities };
      entities[action.payload.id] = action.payload.contact;
      return {
        ...state,
        ids: (state.ids as string[]).concat([action.payload.id]),
        entities: entities
      };
    }

    case ContactActionTypes.AddContactFailed: {
      return {
        ...state,
        loading: false
      }
    }

    case ContactActionTypes.UpdateContact: {
      return {
        ...state,
        loading: true
      }
    }

    case ContactActionTypes.UpdateContactSuccess: {
      return {
        ...adapter.updateOne({ id: action.payload.id, changes: action.payload.contact }, state),
        loading: false
      }
    }

    case ContactActionTypes.UpdateContactFailed: {
      return {
        ...state,
        loading: false
      }
    }

    case ContactActionTypes.DeleteContacts: {
      return {
        ...state,
        loading: true
      }
    }

    case ContactActionTypes.DeleteContactsSuccess: {
      return {
        ...adapter.removeMany(action.payload.ids, state),
        loading: false,
      }
    }

    case ContactActionTypes.DeleteContactsFailed: {
      return {
        ...state,
        loading: false
      }
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
