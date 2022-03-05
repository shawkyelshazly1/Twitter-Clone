import * as notificationActionTypes from "./notification-ActionTypes";
import { io } from "socket.io-client";

export const setSocketIO = (user) => (dispatch) => {
  let socket = "";

  // socket = io("http://localhost:5000"); // for developement

  socket = io("https://twitter-clone-v1-0.herokuapp.com/"); // for production

  dispatch({ type: notificationActionTypes.SET_SOCKET, payload: socket });
  socket.emit("connectedAddUser", user);
};

export const addNotification = (notification) => (dispatch) => {
  dispatch({
    type: notificationActionTypes.ADD_NOTIFICATION,
    payload: notification,
  });
};

export const markNotificationsAsRead = () => (dispatch) => {
  dispatch({ type: notificationActionTypes.MARK_NOTIFICATIONS_AS_READ });
};
