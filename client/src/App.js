import "./App.css";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Homepage from "./components/layout/Homepage";
import store from "./redux/store";
import { useEffect } from "react";
import { loadUser } from "./redux/auth/auth-actions";
import LeftMenu from "./components/layout/LeftMenu";
import RightMenu from "./components/layout/RightMenu";
import { getTFUs } from "./redux/homepage/hompage-actions";
import UserProfile from "./components/layout/UserProfile";
import HashtagPage from "./components/layout/HashtagPage";
import Notifications from "./components/layout/Notifications";
import TweetPage from "./components/layout/TweetPage";
import ErrorAlert from "./components/smallComponents/ErrorAlert";
import SuccessAlert from "./components/smallComponents/SuccessAlert";
import { clearErrors, clearSuccessAlert } from "./redux/error/error-actions";
import MessagesPage from "./components/layout/MessagesPage";
import ChatPage from "./components/layout/ChatPage";

function App() {
  const { socket } = useSelector((state) => state.notifications);
  const { isError, error_messages, isSuccessAlert, successAlertMessage } =
    useSelector((state) => state.err);
  useEffect(() => {
    store.dispatch(clearSuccessAlert());
    store.dispatch(clearErrors());
    store.dispatch(loadUser());
    store.dispatch(getTFUs());
  }, []);

  return (
    <div className="App container mx-auto h-screen ">
      {/* {isError ? <ErrorAlert message={error_messages[0]} /> : <></>} */}
      {isSuccessAlert ? <SuccessAlert message={successAlertMessage} /> : <></>}
      <Router>
        <Routes>
          <Route path="/users/auth/login" element={<Login />} />
          <Route path="/users/auth/register" element={<Register />} />
          <Route
            path="*"
            element={
              <>
                <PrivateRoute>
                  <div className="flex flex-row justify-center">
                    <LeftMenu />
                    <div className="w-full sm:w-600 h-screen">
                      <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route
                          path="/:user_handler"
                          element={<UserProfile />}
                        />
                        <Route
                          path="/hashtag/:hashtagQuery"
                          element={<HashtagPage />}
                        />
                        <Route
                          path="/notifications"
                          element={<Notifications />}
                        />
                        <Route
                          path="/:user_handler/status/:tweetId"
                          element={<TweetPage />}
                        />
                        <Route path="/messages" element={<MessagesPage />} />
                        <Route
                          path="/messages/:conversationId"
                          element={<ChatPage />}
                        />
                      </Routes>
                    </div>
                    <RightMenu />
                  </div>
                </PrivateRoute>
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
