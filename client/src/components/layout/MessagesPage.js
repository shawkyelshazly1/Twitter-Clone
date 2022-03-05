import React, { useEffect } from "react";
import UserChatBox from "../smallComponents/UserChatBox";
import store from "../../redux/store";
import { useSelector } from "react-redux";
import { loadConversations } from "../../redux/conversation/conversation-actions";

export default function MessagesPage() {
  const { loadingConversations, conversations } = useSelector(
    (state) => state.conversations
  );
  useEffect(() => {
    store.dispatch(loadConversations());
  }, []);

  return (
    <div className="flex flex-col gap-2 content-center p-4">
      <div className="flex justify-between items-center px-4 py-3 sticky top-0 bg-white dark:bg-dim-900  border-gray-200 dark:border-gray-700">
        <h2 className="text-gray-800 dark:text-gray-100 font-bold text-xl font-sans">
          Messages
        </h2>
      </div>
      <div className="relative m-2">
        <div className="absolute text-gray-600 flex items-center pl-4 h-full cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-mail"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
          </svg>
        </div>
        <input
          className="w-full bg-gray-200 py-6 dark:bg-dim-400 border-gray-200 dark:border-dim-400 text-black focus:bg-gray-100 dark:focus:bg-dim-900 focus:outline-none focus:border focus:border-blue-200 font-normal h-9 flex items-center pl-12 text-sm rounded-full border shadow"
          placeholder="Search For People"
        />
      </div>
      <div className="flex flex-col m-2 gap-7 p-2">
        {loadingConversations
          ? "loading"
          : conversations.map((conversation) => (
              <UserChatBox key={conversation._id} conversation={conversation} />
            ))}
      </div>
    </div>
  );
}
