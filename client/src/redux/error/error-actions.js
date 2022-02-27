import * as errorActionTypes from "./errorActionTypes";

// Show errors function to dispatch show errors actions with array of errors
export const showErrors = (errors) => (dispatch) => {
  dispatch({ type: errorActionTypes.GET_ERRORS, payload: errors });
};

// Clear errors function to dispatch clearing errors and setting state to []
export const clearErrors = () => (dispatch) => {
  dispatch({ type: errorActionTypes.CLEAR_ERRORS });
};
