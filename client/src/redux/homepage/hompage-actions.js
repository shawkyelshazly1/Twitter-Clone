import axios from "axios";
import { clearErrors, showErrors } from "../error/error-actions";
import store from "../store";
import * as homepageActionTypes from "./homepageActionTypes";

// load Top Followed Users
export const getTFUs = () => (dispatch) => {
  axios
    .get("/api/users/topFollowed", config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: homepageActionTypes.LOAD_TFUS_SUCCESS,
        payload: res.data.users,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: homepageActionTypes.LOAD_TFUS_FAIL });
    });
};

// Loading TWeets from people user follow
export const loadTweets = () => (dispatch) => {
  dispatch({ type: homepageActionTypes.LOADING_TWEETS });

  axios
    .get("/api/tweets", config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: homepageActionTypes.LOADING_TWEETS_SUCCESS,
        payload: res.data.tweets,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: homepageActionTypes.LOADING_TWEETS_FAIL });
    });
};

// Clearing HOmepage & resetting the store
export const clearHomePage = () => (dispatch) => {
  dispatch({ type: homepageActionTypes.CLEAR_HOMEPAGE });
};

// Axios Config
const config = {
  headers: {
    "Content-type": "application/json",
  },
  baseURL: "http://localhost:5000",
  withCredentials: true,
  credentials: "include",
};
