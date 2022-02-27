import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactComponent as LoadingComponent } from "./loading.svg";
import { loadUser } from "./redux/auth/auth-actions";
import store from "./redux/store";
import { useEffect } from "react";
import { getTFUs, loadTweets } from "./redux/homepage/hompage-actions";
import { loadFollowedUsers } from "./redux/user/user-actions";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(getTFUs());
    store.dispatch(loadFollowedUsers());
    store.dispatch(loadTweets());
  }, []);

  if (isLoading) return <LoadingComponent />;

  return isAuthenticated ? children : <Navigate to="/users/auth/login" />;
}
