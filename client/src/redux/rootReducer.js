import { combineReducers } from "redux";
import authReducer from "./auth/auth-reducer";
import errorReducer from "./error/error-reducer";
import homepageReducer from "./homepage/homepage-reducer";
import userReducer from "./user/user-reducer";
import notificationReducer from "./notification/notification-reducer";
import conversationReducer from "./conversation/conversation-reducer";

// Initializing the rootReducer with combining all reducers in it
const rootReducer = combineReducers({
  auth: authReducer,
  err: errorReducer,
  homePage: homepageReducer,
  user: userReducer,
  notifications: notificationReducer,
  conversations: conversationReducer,
});

export default rootReducer;
