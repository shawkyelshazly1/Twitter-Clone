import axios from "axios";
import store from "../store";
import * as authActionTypes from "./authActionTypes";
import { clearErrors, showErrors } from "../error/error-actions";
import { clearHomePage } from "../homepage/hompage-actions";
import { clearUserInfo, loadUserInfo } from "../user/user-actions";

// Login user Action, sending axios post with data showing or clearing errors based on res or err
export const loginUser = (data) => (dispatch) => {
  const body = JSON.stringify(data);

  axios
    .post("/api/users/auth/login", body, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({ type: authActionTypes.LOGIN_SUCCESS });
      store.dispatch(loadUser());
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: authActionTypes.LOGIN_FAIL });
    });
};

// Register User Action, sending axios post request with data showing or clearing errors based on res or err
export const registerUser = (data) => (dispatch) => {
  const body = JSON.stringify(data);

  axios
    .post("/api/users/auth/register", body, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({ type: authActionTypes.REGISTER_SUCCESS });
      console.log(res);
    })
    .catch((err) => {
      console.log(err.response);
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: authActionTypes.REGISTER_FAIL });
    });
};

// Logout User

export const logoutUser = () => (dispatch) => {
  axios
    .get(`/api/users/auth/logout`, config)
    .then((res) => {
      store.dispatch(clearErrors());
      dispatch({ type: authActionTypes.LOGOUT_SUCCESS });
      store.dispatch(clearHomePage());
      store.dispatch(clearUserInfo());
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: authActionTypes.LOGOUT_FAIL });
    });
};

//Verify User & load use object from DB to redux
export const loadUser = () => (dispatch) => {
  dispatch({ type: authActionTypes.USER_LOADING });

  axios
    .get("/api/users/auth", config)
    .then((res) => {
      store.dispatch(clearErrors());
      store.dispatch(loadUserInfo(res.data));
      dispatch({ type: authActionTypes.USER_LOADED, payload: res.data });
    })
    .catch((err) => {
      store.dispatch(showErrors(err.response.data.errors));
      dispatch({ type: authActionTypes.AUTH_ERROR });
    });
};

// Axios Config
const config = {
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
  credentials: "include",
};
