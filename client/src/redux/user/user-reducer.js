import * as userActionTypes from "./userActionTypes";

const initialState = {
  userInfo: null,
  followedUsers: [],
  loadedUser: null,
  loadingUserProfile: true,
  userTweets: [],
  loadingUserTweets: true,
};

const userReducer = function (state = initialState, action) {
  switch (action.type) {
    case userActionTypes.FOLLOW_USER_FAIL:
    case userActionTypes.UNFOLLOW_USER_FAIL:
      return {
        ...state,
      };

    case userActionTypes.FOLLOW_USER_SUCCESS:
      let users = [];
      console.log(action.payload.user);
      if (state.followedUsers.includes(action.payload.user)) {
        return { ...state };
      } else {
        users = state.followedUsers.filter(
          (user) => user !== action.payload.user
        );
        return { ...state, followedUsers: users };
      }

    case userActionTypes.UNFOLLOW_USER_SUCCESS:
      return { ...state };
    case userActionTypes.LOADED_USER_INFO:
      return {
        ...state,
        userInfo: action.payload.user,
      };
    case userActionTypes.LOAD_FOLLOWED_USERS_FAIL:
      return { ...state, followedUsers: [] };
    case userActionTypes.LOAD_FOLLOWED_USERS_SUCCESS:
      return { ...state, followedUsers: action.payload.users };
    case userActionTypes.CLEAR_USER_INFO:
      return { ...state, userInfo: null, followedUsers: [] };

    case userActionTypes.LOADING_USER_PROFILE:
      return { ...state, loadingUserProfile: true };

    case userActionTypes.LOAD_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loadingUserProfile: false,
        loadedUser: action.payload,
      };

    case userActionTypes.LOADING_USER_TWEETS:
      return { ...state, loadingUserTweets: true };
    case userActionTypes.LOAD_USER_TWEETS_SUCCESS:
      return { ...state, loadingUserTweets: false, userTweets: action.payload };
    case userActionTypes.LOAD_USER_TWEETS_FAIL:
      return { ...state, loadingUserTweets: false, userTweets: [] };

    case userActionTypes.LOAD_USER_PROFILE_FAIL:
      return { ...state, loadingUserProfile: false, loadedUser: null };

    default:
      return {
        ...state,
      };
  }
};

export default userReducer;
