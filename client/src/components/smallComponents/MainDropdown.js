import React from "react";
import { Menu, Transition } from "@headlessui/react";
import s from "underscore.string";
import { Link } from "react-router-dom";
import store from "../../redux/store";
import { logoutUser } from "../../redux/auth/auth-actions";

export default function MainDropdown({ user }) {
  const handleLogout = () => {
    store.dispatch(logoutUser());
  };
  return (
    <Menu>
      <Menu.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        ></Transition>
        <div className="w-14 xl:w-full mx-auto mt-auto flex flex-row justify-between mb-5 rounded-full hover:bg-blue-50 dark:hover:bg-dim-800 p-2 cursor-pointer transition duration-350 ease-in-out ">
          <div className="flex flex-row">
            <img
              className="w-10 h-10 rounded-full"
              src={`${user.photo}`}
              alt={`${user.username}`}
            />
            <div className=" xl:block flex flex-col ml-2">
              <h1 className="text-gray-800 dark:text-white font-bold text-sm">
                {`${s.capitalize(user.firstName)}  ${s.capitalize(
                  user.lastName
                )}`}
              </h1>
              <p className="text-gray-400 text-sm">@{user.username}</p>
            </div>
          </div>
          <div className="hidden xl:block">
            <div className="flex items-center h-full text-gray-800 dark:text-white">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 mr-2"
              >
                <g>
                  <path d="M20.207 8.147c-.39-.39-1.023-.39-1.414 0L12 14.94 5.207 8.147c-.39-.39-1.023-.39-1.414 0-.39.39-.39 1.023 0 1.414l7.5 7.5c.195.196.45.294.707.294s.512-.098.707-.293l7.5-7.5c.39-.39.39-1.022 0-1.413z"></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </Menu.Button>
      <Menu.Items>
        <Menu.Item>
          {({ active }) => (
            <Link
              onClick={() => {
                handleLogout();
              }}
              className={`${
                active && "bg-[#60A5FA] text-white"
              } group  flex rounded-md items-center w-full px-2 py-2 text-md`}
              to="/"
            >
              Logout
            </Link>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
