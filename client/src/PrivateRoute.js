import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactComponent as LoadingComponent } from "./loading.svg";
import { loadUser } from "./redux/auth/auth-actions";
import store from "./redux/store";
import { useEffect } from "react";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  if (isLoading) return <LoadingComponent />;

  return isAuthenticated ? children : <Navigate to="/users/auth/login" />;
}
