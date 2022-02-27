import * as userActionTypes from "./userActionTypes";

const initialState = {
  userInfo: null,
  followedUsers: [],
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
    default:
      return {
        ...state,
      };
  }
};

export default userReducer;
