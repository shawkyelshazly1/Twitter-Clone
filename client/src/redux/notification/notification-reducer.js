import * as notificationActionTypes from "./notification-ActionTypes";

const initialState = {
  socket: "",
  notifications: [],
};

const notificationReducer = function (state = initialState, action) {
  switch (action.type) {
    case notificationActionTypes.SET_SOCKET:
      return { ...state, socket: action.payload };
    case notificationActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case notificationActionTypes.MARK_NOTIFICATIONS_AS_READ:
      return { ...state, notifications: [] };
    default:
      return { ...state };
  }
};

export default notificationReducer;
