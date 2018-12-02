import { UserActions, UserActionTypes } from './user.actions';
import { User } from '../../../../../firebase/functions/src/models/user';

export interface State {
  user?: User;
  loading: boolean;
  lastUserId?: string;
}

export const initialState: State = {
  loading: false
};

export function reducer(
  state = initialState,
  action: UserActions
): State {
  switch (action.type) {
    case UserActionTypes.LoginGoogle: {
      return {
        ...state,
        loading: true
      }
    }

    case UserActionTypes.LoginGoogleSuccess: {
      return {
        ...state,
        loading: false
      }
    }

    case UserActionTypes.LoginGoogleFailed: {
      return {
        ...state,
        loading: false
      }
    }

    case UserActionTypes.LoadUser: {
      return {
        ...state,
        loading: true
      }
    }

    case UserActionTypes.LoadUserSuccess: {
      return {
        ...state,
        user: action.payload.user,
        loading: false
      }
    }

    case UserActionTypes.LoadUserFailed: {
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
