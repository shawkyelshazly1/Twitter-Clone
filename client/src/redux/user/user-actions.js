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

// Axios Config
const config = {
  headers: {
    "Content-type": "application/json",
  },

  withCredentials: true,
  credentials: "include",
};
