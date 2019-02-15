import { Action } from '@ngrx/store';
import { ApplicationActions, ApplicationActionTypes } from './application.actions';
import { Application } from '../../../../../../firebase/functions/src/models/application';


export interface State {
  loading: boolean
  error?: Error
  ids: string[]
  entities: { [id: string]: Application }
}

export const initialState: State = {
  loading: false,
  ids: [],
  entities: {}
};

export function reducer(state = initialState, action: ApplicationActions): State {
  switch (action.type) {
    case ApplicationActionTypes.LoadApplications: {
      return {
        ...state,
        loading: true,
      }
    }
    case ApplicationActionTypes.LoadApplicationsSuccess: {
      return {
        ...state,
        loading: false,
        ids: action.payload.ids,
        entities: action.payload.entities
      }
    }
    case ApplicationActionTypes.LoadApplicationsError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }
    case ApplicationActionTypes.AddApplication: {
      return {
        ...state,
        loading: true
      }
    }
    case ApplicationActionTypes.AddApplicationSuccess: {
      const ids = [...state.ids, action.payload.ApplicationId]
      const entities = { ...state.entities }
      entities[action.payload.ApplicationId] = action.payload.Application

      return {
        ...state,
        loading: false,
        ids: ids,
        entities: entities
      }
    }
    case ApplicationActionTypes.AddApplicationError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }
    case ApplicationActionTypes.UpdateApplication: {
      return {
        ...state,
        loading: true,
      }
    }
    case ApplicationActionTypes.UpdateApplicationSuccess: {
      const entities = { ...state.entities }
      entities[action.payload.ApplicationId] = action.payload.Application

      return {
        ...state,
        loading: false,
      }
    }
    case ApplicationActionTypes.UpdateApplicationError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }
    case ApplicationActionTypes.DeleteApplication: {
      return {
        ...state,
        loading: true,
      }
    }
    case ApplicationActionTypes.DeleteApplicationSuccess: {
      const ids = state.ids.filter(id => id !== action.payload.ApplicationId)
      const entities = { ...state.entities }
      delete entities[action.payload.ApplicationId]

      return {
        ...state,
        loading: false,
        ids: ids,
        entities: entities
      }
    }
    case ApplicationActionTypes.DeleteApplicationError: {
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
