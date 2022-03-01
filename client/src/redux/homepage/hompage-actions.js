import axios from "axios";
import { clearErrors, showErrors } from "../error/error-actions";
import store from "../store";
import * as homepageActionTypes from "./homepageActionTypes";

//Update Tweet Chars Count
export const updateTweetCharsCount = (charsCount) => (dispatch) => {
  dispatch({
    type: homepageActionTypes.UPDATE_TWEET_CHARS_COUNT,
    payload: charsCount,
  });
};

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

// Sending New Tweet
export const sendTweet = (tweetData) => (dispatch) => {
  const body = JSON.stringify(tweetData);
  axios
    .post("/api/tweets", body, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: homepageActionTypes.SEND_TWEET_SUCCESS,
        payload: res.data.tweet[0],
      });
      store.dispatch(clearMedia());
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: homepageActionTypes.SEND_TWEET_FAIL });
      store.dispatch(clearMedia());
    });
};

// Setting Media Preview URI
export const setMediaPreview = (file) => (dispatch) => {
  dispatch({
    type: homepageActionTypes.ADD_MEDIA_PREVIEW,
    payload: { previewURI: URL.createObjectURL(file), mediaFile: file },
  });
};

// Clearing Media Preview URI
export const clearMedia = () => (dispatch) => {
  dispatch({ type: homepageActionTypes.CLEAR_MEDIA });
};

// UPload media action
export const sendTweetIncludeMedia = (file, tweetData) => (dispatch) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "fr8uzr1b");
  axios
    .post("https://api.cloudinary.com/v1_1/dwufx31ox/image/upload", formData)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: homepageActionTypes.UPLOAD_MEDIA_SUCCESS,
      });
      tweetData.media = res.data.secure_url;
      console.log(res.data.secure_url);
      store.dispatch(sendTweet(tweetData));
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: homepageActionTypes.UPLOAD_MEDIA_FAIL });
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
