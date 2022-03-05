import * as notificationActionTypes from "./notification-ActionTypes";
import { io } from "socket.io-client";

export const setSocketIO = (userId) => (dispatch) => {
  const socket = io("http://localhost:5000/"); // for developement
  // const socket = io("https://twitter-clone-v1-0.herokuapp.com/"); // for production
  dispatch({ type: notificationActionTypes.SET_SOCKET, payload: socket });
  socket.emit("connectedAddUser", userId);
};

export const addNotification = (notification) => (dispatch) => {
  dispatch({
    type: notificationActionTypes.ADD_NOTIFICATION,
    payload: notification,
  });
};
