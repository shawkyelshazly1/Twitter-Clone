import React from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { loginUser } from "../../redux/auth/auth-actions";
import store from "../../redux/store";
import { ReactComponent as LoadingComnponent } from "../../loading.svg";

export default function Login() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = {
      email: form[0].value,
      password: form[1].value,
    };

    store.dispatch(loginUser(formData));
  };

  if (isLoading) return <LoadingComnponent />;

  return isAuthenticated ? (
    <Navigate to="/" />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-3/3 lg:w-3/3 sm:w-3/3">
        <h3 className="text-2xl font-bold text-center">Login</h3>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="mt-4">
            <div className="mt-4">
              <label className="block" htmlFor="email">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block">
                Password
              </label>
              <input
                required
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex">
              <button className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Login
              </button>
            </div>
            <div className="mt-6 text-grey-dark">
              Don't have an account?
              <Link
                className="text-blue-600 hover:underline"
                to="/users/auth/register"
              >
                {" "}
                Register
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
