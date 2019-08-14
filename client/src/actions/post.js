import { setAlert } from './alert';
import axios from 'axios';

import {
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from './types';

// GET ALL POSTS
export const getPosts = () => async dispatch => {

  try {
    const res = await axios.get('/api/posts');

    dispatch({
      type: GET_POSTS,
      payload: res.data
    })


  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload:
      {
        msg: e.response.statusText,
        status: e.response.status
      }
    })

  }
}

export const getPost = id => async dispatch => {

  try {
    const res = await axios.get(`/api/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data
    })


  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload:
      {
        msg: e.response.statusText,
        status: e.response.status
      }
    })

  }
}


export const deletePost = id => async dispatch => {

  try {
    await axios.delete(`/api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id,
    });

    dispatch(setAlert('Post Removed!', 'success'))
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload:
      {
        msg: e.response.statusText,
        status: e.response.status
      }
    })

  }
}

export const addPost = FormData => async dispatch => {

  const config = {
    headers: {
      "Content-Type": "Application/json"
    }
  }

  try {
    const res = await axios.post('/api/posts', FormData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data,
    });

    dispatch(setAlert('Post Created!', 'success'))
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload:
      {
        msg: e.response.statusText,
        status: e.response.status
      }
    })

  }
}

//
export const addComment = (postId,FormData) => async dispatch => {

  const config = {
    headers: {
      "Content-Type": "Application/json"
    }
  }

  try {
    const res = await axios.post(`/api/posts/comment/${postId}`, FormData, config);

    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });

    dispatch(setAlert('Comment Added!', 'success'))
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload:
      {
        msg: e.response.statusText,
        status: e.response.status
      }
    })

  }
}
export const removeComment = (postId,commentId) => async dispatch => {


  try {
   await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    });

    dispatch(setAlert('Comment Removed.', 'success'))
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload:
      {
        msg: e.response.statusText,
        status: e.response.status
      }
    })

  }
}

// ADD LIKES
export const addLike = id => async dispatch => {

  try {
    const res = await axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    })
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload:
      {
        msg: e.response.statusText,
        status: e.response.status
      }
    })

  }
}

//remove likes
export const removeLike = id => async dispatch => {

  try {
    const res = await axios.put(`/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    })
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload:
      {
        msg: e.response.statusText,
        status: e.response.status
      }
    })

  }
}