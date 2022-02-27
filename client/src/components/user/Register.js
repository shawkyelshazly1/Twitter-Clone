import React from "react";
import { Link, Navigate } from "react-router-dom";
import store from "../../redux/store";
import { registerUser } from "../../redux/auth/auth-actions";
import { useSelector } from "react-redux";
import { ReactComponent as LoadingComnponent } from "../../loading.svg";

export default function Register() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return <LoadingComnponent />;

  let gender = "male";

  const onChangeGender = (e) => {
    gender = e.target.value;
  };

  let formData = {};

  const getFormData = (e) => {
    formData = {
      firstName: e.target[0].value,
      lastName: e.target[1].value,
      username: e.target[2].value,
      email: e.target[3].value,
      gender,
      dateOfBirth: e.target[6].value,
      password: e.target[7].value,
      confirmPassword: e.target[8].value,
    };
  };

  const submitForm = (e) => {
    e.preventDefault();
    getFormData(e);
    store.dispatch(registerUser(formData));
  };

  return isAuthenticated ? (
    <Navigate to="/" />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg   w-2/5">
        <h3 className="text-2xl font-bold text-center">Join us</h3>
        <form
          onSubmit={(e) => {
            submitForm(e);
          }}
        >
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="firstName">
                First Name
              </label>
              <input
                required
                type="text"
                id="firstName"
                placeholder="First Name"
                name="firstName"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="lastName">
                Last Name
              </label>
              <input
                required
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="username">
                Username
              </label>
              <input
                required
                type="text"
                name="username"
                placeholder="Username"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
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
              <label className="block mb-2" htmlFor="gender">
                Gender
              </label>
              <div className="flex flex-row gap-3" name="gender">
                <label htmlFor="gender">
                  <input
                    onChange={(e) => {
                      onChangeGender(e);
                    }}
                    type="radio"
                    value="female"
                    name="gender"
                  />{" "}
                  Female
                </label>
                <label htmlFor="gender">
                  <input
                    type="radio"
                    value="male"
                    name="gender"
                    defaultChecked
                    onChange={(e) => {
                      onChangeGender(e);
                    }}
                  />{" "}
                  Male
                </label>
              </div>
            </div>
            <div className="mt-4 flex-row flex gap-2 justify-items-center content-center items-center">
              <label htmlFor="dateOfBirth">Date Of Birth: </label>
              <input className="" type="date" name="dateOfBirth" required />
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
            <div className="mt-4">
              <label className="block" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                required
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <span className="text-xs text-red-400">Password must be same!</span>
            <div className="flex">
              <button className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Create Account
              </button>
            </div>
            <div className="mt-6 text-grey-dark">
              Already have an account?
              <Link
                className="text-blue-600 hover:underline"
                to="/users/auth/login"
              >
                {" "}
                Log in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
