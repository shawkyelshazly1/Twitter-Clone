import * as authActionTypes from "./authActionTypes";

// Setting the auth initial state
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// Setting auth reducer with actions {user_loading, user_loaded, login_fail, login_success, register_fail, register_success}
const authReducer = function (state = initialState, action) {
  switch (action.type) {
    case authActionTypes.USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case authActionTypes.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
      };

    case authActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
      };

    case authActionTypes.LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true, isLoading: false };

    case authActionTypes.LOGIN_FAIL:
    case authActionTypes.REGISTER_FAIL:
    case authActionTypes.LOGOUT_SUCCESS:
    case authActionTypes.AUTH_ERROR:
    case authActionTypes.LOGOUT_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };

    default:
      return { ...state };
  }
};

export default authReducer;
