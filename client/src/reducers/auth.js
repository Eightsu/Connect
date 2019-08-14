import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null, // on request this gets updated to true if successful
  isLoading: true, // on request set to false
  user: null, // on request to backend gets updated
}

export default function (state = initialState, action) {

  const { type, payload } = action

  //Dispatch
  // "token" is the the bcrypt token that comes with payload

  switch (type) {

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: payload  // is this case the payload incluse the data of the user, but no password.
      }



    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token)
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        isLoading: false
      }

    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false
      }



    default:
      return state;
  }


} 