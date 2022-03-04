import * as homepageActionTypes from "./homepageActionTypes";

const initialState = {
  top_followed: [],
  tweets: [],
  loadingTweets: false,
  loadingTFUs: false,
  tweetCharsCount: 0,
  uploadedMediaURI: "",
  mediaPreviewURI: "",
  mediaFile: "",
  topHashtags: [],
};

const homepageReducer = function (state = initialState, action) {
  switch (action.type) {
    case homepageActionTypes.LOAD_TFUS_FAIL:
      return {
        ...state,
        top_followed: [],
        loadingTFUs: false,
      };
    case homepageActionTypes.LOADING_TFUS:
      return { ...state, loadingTFUs: true };
    case homepageActionTypes.LOAD_TFUS_SUCCESS:
      return {
        ...state,
        top_followed: action.payload,
        loadingTFUs: false,
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
    case homepageActionTypes.LOAD_HASHTAG_TWEETS_SUCCESS:
      return { ...state, loadingTweets: false, tweets: action.payload };

    case homepageActionTypes.LOADING_TWEETS_FAIL:
    case homepageActionTypes.LOAD_HASHTAG_TWEETS_FAIL:
      return { ...state, loadingTweets: false, tweets: [] };

    case homepageActionTypes.UPDATE_TWEET_CHARS_COUNT:
      return {
        ...state,
        tweetCharsCount: action.payload,
      };
    case homepageActionTypes.LOAD_TOP_HASHTAGS_SUCCESS:
      return { ...state, topHashtags: action.payload };
    case homepageActionTypes.LOAD_TOP_HASHTAGS_FAIL:
      return { ...state, topHashtags: [] };

    case homepageActionTypes.CLEAR_MEDIA:
      return {
        ...state,
        mediaPreviewURI: "",
        mediaFile: "",
        uploadedMediaURI: "",
      };
    case homepageActionTypes.ADD_MEDIA_PREVIEW:
      return {
        ...state,
        mediaPreviewURI: action.payload.previewURI,
        mediaFile: action.payload.mediaFile,
      };

    case homepageActionTypes.UPLOAD_MEDIA_FAIL:
      return { ...state, uploadedMediaURI: "", mediaFile: "" };

    case homepageActionTypes.LIKE_TWEET_SUCCESS:
      let tweetId = action.payload;
      let editedTweet = state.tweets.filter(
        (tweet) => tweet.tweet._id === tweetId
      )[0];
      editedTweet.tweet.isLiked = true;
      editedTweet.tweet.tweetStats.likesCount += 1;
      return {
        ...state,
        tweets: state.tweets.map((tweet) =>
          tweet._id === tweetId ? editedTweet : tweet
        ),
      };

    case homepageActionTypes.DISLIKE_TWEET_SUCCESS:
      let Id = action.payload;
      let dislikedTweet = state.tweets.filter(
        (tweet) => tweet.tweet._id === Id
      )[0];
      dislikedTweet.tweet.isLiked = false;
      if (dislikedTweet.tweet.tweetStats.likesCount > 0) {
        dislikedTweet.tweet.tweetStats.likesCount -= 1;
      }
      return {
        ...state,
        tweets: state.tweets.map((tweet) =>
          tweet._id === Id ? dislikedTweet : tweet
        ),
      };

    case homepageActionTypes.SEND_TWEET_FAIL:
    case homepageActionTypes.UPLOAD_MEDIA_SUCCESS:
    case homepageActionTypes.LIKE_TWEET_FAIL:
    case homepageActionTypes.DISLIKE_TWEET_FAIL:
      return { ...state };

    case homepageActionTypes.SEND_TWEET_SUCCESS:
      return {
        ...state,
        tweets: [action.payload, ...state.tweets],
        uploadedMediaURI: "",
      };

    default:
      return {
        ...state,
      };
  }
};

export default homepageReducer;
