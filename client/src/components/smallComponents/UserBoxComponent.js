import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import s from "underscore.string";
import store from "../../redux/store";
import { followUser } from "../../redux/user/user-actions";

export default function UserBoxComponent({ user }) {
  const { socket } = useSelector((state) => state.notifications);
  const { userInfo } = useSelector((state) => state.user);

  const handleFollowUser = () => {
    const notificationData = {
      type: "userFollow",
      sender: userInfo,
      reciever: user._id,
      msg: `${userInfo.username} Started following you.`,
      link: `/${userInfo.username}`,
    };
    store.dispatch(
      followUser(user._id, user.username, socket, notificationData)
    );
  };
  return (
    <div className="text-blue-400 text-sm font-normal p-3 border-b border-gray-200 dark:border-dim-200 hover:bg-gray-100 dark:hover:bg-dim-300 cursor-pointer transition duration-350 ease-in-out">
      <div className="flex flex-row justify-between p-2">
        <Link to={`/${user.username}`}>
          <div className="flex flex-row">
            <img
              className="w-10 h-10 rounded-full"
              src="https://pbs.twimg.com/profile_images/1308769664240160770/AfgzWVE7_normal.jpg"
              alt="Joe Biden"
            />
            <div className="flex flex-col ml-2">
              <h1 className="text-gray-900 dark:text-white font-bold text-sm">
                {`${s.capitalize(user.firstName)}  ${s.capitalize(
                  user.lastName
                )}`}
              </h1>
              <p className="text-gray-400 text-sm">@{user.username}</p>
            </div>
          </div>
        </Link>
        <div
          onClick={() => {
            handleFollowUser();
          }}
          className=""
        >
          <div className="flex items-center h-full text-gray-800 dark:text-white">
            <p className="text-xs font-bold text-blue-400 px-4 py-1 rounded-full border-2 border-blue-400">
              Follow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
