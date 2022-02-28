import * as homepageActionTypes from "./homepageActionTypes";

const initialState = {
  top_followed: [],
  tweets: [],
  loadingTweets: false,
  tweetCharsCount: 0,
};

const homepageReducer = function (state = initialState, action) {
  switch (action.type) {
    case homepageActionTypes.LOAD_TFUS_FAIL:
      return {
        ...state,
        top_followed: [],
      };

    case homepageActionTypes.LOAD_TFUS_SUCCESS:
      return {
        ...state,
        top_followed: action.payload,
      };

    case homepageActionTypes.CLEAR_HOMEPAGE:
      return {
        ...state,
        loadingTweets: false,
        top_followed: [],
        tweets: [],
      };
    case homepageActionTypes.LOADING_TWEETS:
      return { ...state, loadingTweets: true };

    case homepageActionTypes.LOADING_TWEETS_SUCCESS:
      return { ...state, loadingTweets: false, tweets: action.payload };

    case homepageActionTypes.LOADING_TWEETS_FAIL:
      return { ...state, loadingTweets: false, tweets: [] };

    case homepageActionTypes.UPDATE_TWEET_CHARS_COUNT:
      return {
        ...state,
        tweetCharsCount: action.payload,
      };

    case homepageActionTypes.SEND_TWEET_FAIL:
    case homepageActionTypes.UPLOAD_MEDIA_FAIL:
    case homepageActionTypes.UPLOAD_MEDIA_SUCCESS:
      return { ...state };

    case homepageActionTypes.SEND_TWEET_SUCCESS:
      return { ...state, tweets: [action.payload, ...state.tweets] };

    default:
      return {
        ...state,
      };
  }
};

export default homepageReducer;
