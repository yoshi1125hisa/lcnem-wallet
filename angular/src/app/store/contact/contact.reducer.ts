import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Contact } from './contact.model';
import { ContactActions, ContactActionTypes } from './contact.actions';

export interface State extends EntityState<Contact> {
  loading: boolean
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
    case ContactActionTypes.AddContact: {
      return adapter.addContact(action.payload.contact, state);
    }
    case ContactActionTypes.AddContactSuccess: {
      return adapter.addContact(action.payload.contact, state);
    }
    case ContactActionTypes.AddContactFailed: {
      return adapter.addContact(action.payload.contact, state);
    }

    case ContactActionTypes.AddContactSuccess: {
      let entities = { ...state.entities };
      entities[action.payload.id] = action.payload.contact;
      return {
        ids: (state.ids as string[]).concat([action.payload.id]),
        entities: entities,
        loading: state.loading
      };
    }

    case ContactActionTypes.UpdateContact: {
      return adapter.updateOne(action.payload, state);
    }

    case ContactActionTypes.DeleteContacts: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case ContactActionTypes.LoadContactsSuccess: {
      //後回し
      return adapter.addAll(action.payload, state);
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
