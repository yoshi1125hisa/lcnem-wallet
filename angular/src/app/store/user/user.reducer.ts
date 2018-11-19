import { UserActions, UserActionTypes } from './user.actions';

export interface State {
  // additional entities state properties
}

export const initialState: State = {
  // additional entity state properties
};

export function reducer(
  state = initialState,
  action: UserActions
): State {
  switch (action.type) {
    case UserActionTypes.LoginGoogle: {
      return {
        ...state
      }
    }

    case UserActionTypes.LoginGoogleSuccess: {
      return {
        ...state
      }
    }

    case UserActionTypes.LoginGoogleFailed: {
      return {
        ...state
      }
    }

    default: {
      return state;
    }
  }
}
