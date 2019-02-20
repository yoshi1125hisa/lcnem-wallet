import { Action } from '@ngrx/store';
import { User } from '../../../../../firebase/functions/src/models/user';
import { UserActions, UserActionTypes } from './user.actions';


export interface State {
  loading: boolean
  error?: Error
  user?: User
  lastUserId?: string
}

export const initialState: State = {
  loading: true
};

export function reducer(state = initialState, action: UserActions): State {
  switch (action.type) {
    case UserActionTypes.LoadUser: {
      return {
        ...state,
        loading: true
      }
    }
    case UserActionTypes.LoadUserSuccess: {
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        lastUserId: action.payload.userId
      }
    }
    case UserActionTypes.LoadUserError: {
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
