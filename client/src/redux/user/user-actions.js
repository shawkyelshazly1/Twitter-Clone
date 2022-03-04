import * as userActionTypes from "./userActionTypes";
import axios from "axios";
import store from "../store";
import { clearErrors, showErrors } from "../error/error-actions";

// Loading User info and storing it in store using the auth loaduser handler
export const loadUserInfo = (user) => (dispatch) => {
  dispatch({ type: userActionTypes.LOADED_USER_INFO, payload: user });
};

export const clearUserInfo = () => (dispatch) => {
  dispatch({ type: userActionTypes.CLEAR_USER_INFO });
};

export const loadFollowedUsers = () => (dispatch) => {
  axios
    .get("/api/users/followedUsers", config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: userActionTypes.LOAD_FOLLOWED_USERS_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: userActionTypes.LOAD_FOLLOWED_USERS_FAIL });
    });
};

// Follow User action
export const followUser = (user_id, user_handler) => (dispatch) => {
  const data = {
    followingId: user_id,
  };

  const body = JSON.stringify(data);
  axios
    .post(`/api/users/${user_handler}/follow`, body, config)
    .then((res) => {
      store.dispatch(clearErrors());

      dispatch({
        type: userActionTypes.FOLLOW_USER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: userActionTypes.FOLLOW_USER_FAIL });
    });
};

// Load user profile
export const loadUserProfile = (user_handler) => (dispatch) => {
  dispatch({ type: userActionTypes.LOADING_USER_PROFILE });
  axios
    .get(`/api/users/${user_handler}/profile`, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: userActionTypes.LOAD_USER_PROFILE_SUCCESS,
        payload: res.data.user,
      });
      store.dispatch(loadUserTweets(res.data.user._id, user_handler));
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: userActionTypes.LOAD_USER_PROFILE_FAIL });
    });
};

// Load user tweets to get in profile
export const loadUserTweets = (userId, user_handler) => (dispatch) => {
  dispatch({ type: userActionTypes.LOADING_USER_TWEETS });

  const specialConfig = config;
  specialConfig.params = {
    userId,
  };

  axios
    .get(`api/tweets/${user_handler}`, specialConfig)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: userActionTypes.LOAD_USER_TWEETS_SUCCESS,
        payload: res.data.tweets,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: userActionTypes.LOAD_USER_TWEETS_FAIL });
    });
};

// Like Tweet
export const likeUserTweet = (tweetId, socket, userId) => (dispatch) => {
  const body = JSON.stringify({ tweetId });
  axios
    .post(`/api/tweets/${tweetId}/like`, body, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: userActionTypes.LIKE_USER_TWEET_SUCCESS,
        payload: tweetId,
      });
      socket.emit("tweetLike", userId);
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: userActionTypes.LIKE_USER_TWEET_FAIL });
    });
};

//Dislike Tweet
export const disLikeUserTweet = (tweetId) => (dispatch) => {
  const body = JSON.stringify({ tweetId });
  axios
    .post(`/api/tweets/${tweetId}/dislike`, body, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: userActionTypes.DISLIKE_USER_TWEET_SUCCESS,
        payload: tweetId,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: userActionTypes.DISLIKE_USER_TWEET_FAIL });
    });
};

// Axios Config
const config = {
  headers: {
    "Content-type": "application/json",
  },
  baseURL: process.env.REACT_APP_DEV_BASEURL || "",
  withCredentials: true,
  credentials: "include",
};
