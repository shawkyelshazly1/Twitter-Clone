import React from "react";
import { Link } from "react-router-dom";
export default function Notification({ notification }) {
  return (
    <Link to={notification.link}>
      <div className="flex flex-col gap-2 p-5">
        <div className="flex flex-row justify-between p-2">
          <a href="/shaq1">
            <div className="flex flex-row">
              <img
                className="w-10 h-10 rounded-full"
                src={notification.sender.photo}
                alt={notification.sender.username}
              />
              <div className="flex flex-col ml-2 justify-center">
                <h1 className="text-gray-900 dark:text-white font-bold text-sm">
                  {notification.msg}
                </h1>
              </div>
            </div>
          </a>
        </div>
      </div>
    </Link>
  );
}
