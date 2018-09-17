import axios from 'axios';

import { ADD_POST, GET_ERRORS, POST_LOADING, GET_POSTS, DELETE_POST } from './types';

// Add Post
export const addPost = payload => dispatch => {
  axios.post('/api/posts', payload)
    .then(res =>
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

// Delete Post
export const deletePost = postId => dispatch => {
  axios.delete(`/api/posts/${postId}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: postId
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

// Like Post
export const addLike = postId => dispatch => {
  axios.post(`/api/posts/like/${postId}`)
    .then(res => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

// Like Post
export const removeLike = postId => dispatch => {
  axios.delete(`/api/posts/unlike/${postId}`)
    .then(res => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

// Get Posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios.get('/api/posts')
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
}

export const setPostLoading = () => {
  return {
    type: POST_LOADING
  }
}
