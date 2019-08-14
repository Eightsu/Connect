
import { setAlert } from './alert';
import axios from 'axios';


import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_REPOS

} from './types';


// get all profiles
export const getAllProfiles =() => async dispatch => {

  dispatch({
    type: CLEAR_PROFILE
  });

  try {
   const res =  await axios.get('/api/profile');

   dispatch({
     type: GET_PROFILES,
     payload: res.data
   });
  } catch (e) {

    dispatch({
      type: PROFILE_ERROR,
      payload:
      {
        msg: "Not working. Sorry",
        status:400
      }
    });
  
  }

}




// Get Specific Profile
export const getProfileById = userId => async dispatch => {



  try {

   const res =  await axios.get(`/api/profile/user/${userId}`);

   dispatch({
     type: GET_PROFILE,
     payload: res.data
   });
  } catch (e) {

    dispatch({
      type: PROFILE_ERROR,
      payload:
      {
        msg: e.response.statusText,
        status: e.response.status
      }
    });
  
  }

}

//get current user profile
export const getCurrentProfile = () => async dispatch => {

  try {

    const res = await axios.get('/api/profile/me');
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      payload:
      {
        msg: e.response.statusText,
        status: e.response.status
      }
    });

  }
}

// Create or Update Profile 

export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.post('/api/profile', formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit ? 'Profile Updated!' : 'Profile Created!', 'success'))

    // history is how u redirect in actions
    if (!edit) {
      history.push('/dashboard');
    }



  } catch (e) {

    const errors = e.response.data.errors;

    if (errors) {
      errors.forEach(error =>
        dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: e.response.statusText, status: e.response.status }
    })

  }
}


// Get Github Repos 

export const getGithubRepos = (username) => async dispatch => {

  try {
    const res = await axios.get(`/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data
    })
  }

  catch(e) {

    dispatch({
      type: PROFILE_ERROR,
      payload:
      {
        msg: e.response.statusText,
        status: e.response.status
      }
    });
  }
}

// add experience

export const addExperience = (formData, history) => async dispatch => {
  try {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put('/api/profile/experience', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Experience Added!", "success"));
    history.push('/dashboard');
  } catch (e) {

    const errors = e.response.data.errors;

    if (errors) {
      errors.forEach(error =>
        dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  
  }

}

//Add Education 

export const addEducation = (formData, history) => async dispatch => {
  try {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put('/api/profile/education', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Education Added!", "success"));
    history.push('/dashboard');
  } catch (e) {

    const errors = e.response.data.errors;

    if (errors) {
      errors.forEach(error =>
        dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: e.response.statusText, status: e.response.status }
    })

  }

}

export const deleteExperience = id => async dispatch => {
  try {
  
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Removed!', 'success'))
  } catch (e) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}

// DELETE EDUCATION
export const deleteEducation = id => async dispatch => {
  try {
  
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Removed!', 'success'))
  } catch (e) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}

// Delete Acc & Profile
  export const deleteAccount = () => async dispatch => {

    if (window.confirm('Are you sure? This is permanent.'))
    try {
    
      await axios.delete(`/api/profile`);
      dispatch({type: CLEAR_PROFILE });
      dispatch({type: ACCOUNT_DELETED });
  
      dispatch(setAlert('Your account has been deleted!!'));
    } catch (e) {
      dispatch({
        type: 'PROFILE_ERROR',
        payload: { msg: e.response.statusText, status: e.response.status }
      })
    }
  }