import axios from 'axios';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_PROFILE
} from './types';


// LOAD USER
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });

  } catch (e) {
    dispatch({
      type: AUTH_ERROR
    });

  }
}


// REGISTER USER
export const register = ({
  name,
  email,
  password

}) => async dispatch => {

  // preparing the data to send
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const body = JSON.stringify({ name, email, password });


  try {
    const res = await axios.post('/api/users', body, config) // sending data to the backend.

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());

  } catch (e) {

    const errors = e.response.data.errors;

    if (errors) {
      errors.forEach(error =>
        dispatch(setAlert(error.msg, 'danger')));
    }


    dispatch({
      type: REGISTER_FAIL
    });


  }
}
// LOGIN USER
export const loginUser = (email, password) => async dispatch => {

  // preparing the data to send
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }
  const body = JSON.stringify({ email, password });


  try {
    const res = await axios.post('/api/auth', body, config) // sending data to the backend.

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());


  } catch (e) {

    const errors = e.response.data.errors;

    if (errors) {
      errors.forEach(error =>
        dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAIL
    });


  }
}

// LOGOUT AND CLEAR PROFILE

export const logout = () => dispatch =>{
  dispatch({
    type: CLEAR_PROFILE
  });
  dispatch({
    type: LOGOUT
  });

}

