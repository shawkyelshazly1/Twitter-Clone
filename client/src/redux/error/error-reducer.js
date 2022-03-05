import * as errorActionTypes from "./errorActionTypes";

// creating the initial state
const initialState = {
  isError: false,
  error_messages: [],
  isSuccessAlert: false,
  successAlertMessage: "",
};

// initializing the errors reducer {show errors, clear errors } actions
const errorReducer = function (state = initialState, action) {
  switch (action.type) {
    case errorActionTypes.GET_ERRORS:
      return {
        ...state,
        isError: true,
        error_messages: action.payload,
      };
    case errorActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        isError: false,
        error_messages: [],
      };
    case errorActionTypes.GET_SUCCESS_ALERT:
      return {
        ...state,
        isSuccessAlert: true,
        successAlertMessage: action.payload,
      };
    case errorActionTypes.CLEAR_SUCCESS_ALERT:
      return { ...state, isSuccessAlert: false, successAlertMessage: "" };
    default:
      return { ...state };
  }
};

export default errorReducer;
