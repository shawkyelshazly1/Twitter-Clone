import axios from "axios";
import { clearErrors, showErrors } from "../error/error-actions";
import { useSelector } from "react-redux";
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
  dispatch({ type: homepageActionTypes.LOADING_TFUS });
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

// Like Tweet
export const likeTweet =
  (tweetId, socket, tweetAuthor, currentUser) => (dispatch) => {
    const body = JSON.stringify({ tweetId });
    axios
      .post(`/api/tweets/${tweetId}/like`, body, config)
      .then((res) => {
        store.dispatch(clearErrors());
        dispatch({
          type: homepageActionTypes.LIKE_TWEET_SUCCESS,
          payload: tweetId,
        });
        if (currentUser._id !== tweetAuthor._id) {
          socket.emit("sendNotification", {
            type: "tweetLike",
            sender: currentUser,
            reciever: tweetAuthor._id,
            msg: `${currentUser.username} Liked your Tweet`,
            link: `/${tweetAuthor.username}/status/${tweetId}`,
          });
        }
      })
      .catch((err) => {
        store.dispatch(showErrors(err.response.data.errors));
        dispatch({ type: homepageActionTypes.LIKE_TWEET_FAIL });
      });
  };

export const likeSpecificTweet =
  (tweetId, socket, tweetAuthor, currentUser) => (dispatch) => {
    const body = JSON.stringify({ tweetId });
    axios
      .post(`/api/tweets/${tweetId}/like`, body, config)
      .then((res) => {
        store.dispatch(clearErrors());
        dispatch({
          type: homepageActionTypes.LIKE_SPECIFIC_TWEET,
          payload: tweetId,
        });
        if (currentUser._id !== tweetAuthor._id) {
          socket.emit("sendNotification", {
            type: "tweetLike",
            sender: currentUser,
            reciever: tweetAuthor._id,
            msg: `${currentUser.username} Liked your Tweet`,
            link: `/${tweetAuthor.username}/status/${tweetId}`,
          });
        }
      })
      .catch((err) => {
        store.dispatch(showErrors(err.response.data.errors));
        dispatch({ type: homepageActionTypes.LIKE_TWEET_FAIL });
      });
  };

//Dislike Tweet
export const disLikeTweet = (tweetId) => (dispatch) => {
  const body = JSON.stringify({ tweetId });
  axios
    .post(`/api/tweets/${tweetId}/dislike`, body, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: homepageActionTypes.DISLIKE_TWEET_SUCCESS,
        payload: tweetId,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: homepageActionTypes.DISLIKE_TWEET_FAIL });
    });
};

export const disLikeSpecificTweet = (tweetId) => (dispatch) => {
  const body = JSON.stringify({ tweetId });
  axios
    .post(`/api/tweets/${tweetId}/dislike`, body, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: homepageActionTypes.DISLIKE_SPECIFIC_TWEET,
        payload: tweetId,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: homepageActionTypes.DISLIKE_TWEET_FAIL });
    });
};

// Clearing HOmepage & resetting the store
export const clearHomePage = () => (dispatch) => {
  dispatch({ type: homepageActionTypes.CLEAR_HOMEPAGE });
};

// Sending New Tweet
export const sendTweet = (tweetData, socket, currentUser) => (dispatch) => {
  const body = JSON.stringify(tweetData);
  axios
    .post("/api/tweets", body, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: homepageActionTypes.SEND_TWEET_SUCCESS,
        payload: res.data.tweet[0],
      });

      const mentions = res.data.tweet[0].tweet.entities.mentions;

      if (mentions.length > 0) {
        mentions.forEach((mention) => {
          if (mention !== currentUser.username) {
            let notificationData = {
              type: "tweetMention",
              sender: currentUser,
              reciever: mention,
              msg: `${currentUser.username} Mentioned you in a tweet.`,
              link: `/${currentUser.username}/status/${res.data.tweet[0].tweet._id}`,
            };
            socket.emit("sendNotification", notificationData);
          }
        });
      }
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
export const sendTweetIncludeMedia =
  (file, tweetData, socket, currentUser) => (dispatch) => {
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
        store.dispatch(sendTweet(tweetData, socket, currentUser));
      })
      .catch((err) => {
        store.dispatch(showErrors(err.response.data.errors));
        dispatch({ type: homepageActionTypes.UPLOAD_MEDIA_FAIL });
      });
  };

// Get tweets by hashtag
export const getHashtagTweets = (hashtagQuery) => (dispatch) => {
  axios
    .get(`/api/tweets/hashtag/${hashtagQuery}`, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: homepageActionTypes.LOAD_HASHTAG_TWEETS_SUCCESS,
        payload: res.data.tweets,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: homepageActionTypes.LOAD_HASHTAG_TWEETS_FAIL });
    });
};

// get top hashtags
export const getTopHashtags = () => (dispatch) => {
  axios
    .get(`/api/tweets/hashtags/top`, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: homepageActionTypes.LOAD_TOP_HASHTAGS_SUCCESS,
        payload: res.data.hashtags,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: homepageActionTypes.LOAD_TOP_HASHTAGS_FAIL });
    });
};

//get tweet
export const getTWeet = (tweetId) => (dispatch) => {
  dispatch({ type: homepageActionTypes.LOADING_SPECIFIC_TWEET });
  axios
    .get(`/api/tweets/status/${tweetId}`, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({
        type: homepageActionTypes.LOAD_SPECIFIC_TWEET_SUCCESS,
        payload: res.data.tweet,
      });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: homepageActionTypes.LOAD_SPECIFIC_TWEET_FAIL });
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
