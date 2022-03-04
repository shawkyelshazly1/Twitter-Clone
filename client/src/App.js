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

function App() {
  const { socket } = useSelector((state) => state.notifications);
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(getTFUs());
  }, []);

  return (
    <div className="App container mx-auto h-screen">
      <Router>
        <Routes>
          <Route path="/users/auth/login" element={<Login />} />
          <Route path="/users/auth/register" element={<Register />} />
          <Route
            path="*"
            element={
              <PrivateRoute>
                <div className="flex flex-row justify-center">
                  <LeftMenu />
                  <div className="w-full sm:w-600 h-screen">
                    <Routes>
                      <Route path="/" element={<Homepage />} />
                      <Route path="/:user_handler" element={<UserProfile />} />
                      <Route
                        path="/hashtag/:hashtagQuery"
                        element={<HashtagPage />}
                      />
                      <Route path="/notifications" element={<Notifications />} />
                    </Routes>
                  </div>
                  <RightMenu />
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
