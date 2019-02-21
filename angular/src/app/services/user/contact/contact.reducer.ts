import { Action } from '@ngrx/store';
import { ContactActions, ContactActionTypes } from './contact.actions';
import { Contact } from '../../../../../../firebase/functions/src/models/contact';


export interface State {
  loading: boolean;
  error?: Error;
  ids: string[];
  entities: { [id: string]: Contact };
  lastUserId?: string;
}

export const initialState: State = {
  loading: true,
  ids: [],
  entities: {}
};

export function reducer(state = initialState, action: ContactActions): State {
  switch (action.type) {
    case ContactActionTypes.LoadContacts: {
      return {
        ...state,
        loading: true,
      };
    }
    case ContactActionTypes.LoadContactsSuccess: {
      return {
        ...state,
        loading: false,
        ids: action.payload.ids,
        entities: action.payload.entities,
        lastUserId: action.payload.userId
      };
    }
    case ContactActionTypes.LoadContactsError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    }
    case ContactActionTypes.AddContact: {
      return {
        ...state,
        loading: true
      };
    }
    case ContactActionTypes.AddContactSuccess: {
      const ids = [...state.ids, action.payload.contactId];
      const entities = { ...state.entities };
      entities[action.payload.contactId] = action.payload.contact;

      return {
        ...state,
        loading: false,
        ids: ids,
        entities: entities
      };
    }
    case ContactActionTypes.AddContactError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    }
    case ContactActionTypes.UpdateContact: {
      return {
        ...state,
        loading: true,
      };
    }
    case ContactActionTypes.UpdateContactSuccess: {
      const entities = { ...state.entities };
      entities[action.payload.contactId] = action.payload.contact;

      return {
        ...state,
        loading: false,
      };
    }
    case ContactActionTypes.UpdateContactError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    }
    case ContactActionTypes.DeleteContact: {
      return {
        ...state,
        loading: true,
      };
    }
    case ContactActionTypes.DeleteContactSuccess: {
      const ids = state.ids.filter(id => id !== action.payload.contactId);
      const entities = { ...state.entities };
      delete entities[action.payload.contactId];

      return {
        ...state,
        loading: false,
        ids: ids,
        entities: entities
      };
    }
    case ContactActionTypes.DeleteContactError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    }
    default: {
      return state;
    }
  }
}
