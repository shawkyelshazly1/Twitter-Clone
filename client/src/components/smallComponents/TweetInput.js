import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  sendTweet,
  sendTweetIncludeMedia,
  updateTweetCharsCount,
  uploadMedia,
} from "../../redux/homepage/hompage-actions";
import store from "../../redux/store";
import MediaInput from "./MediaInput";
import MediaPreview from "./MediaPreview";
import ProgressCircle from "./ProgressCircle";

export default function TweetInput() {
  const { userInfo } = useSelector((state) => state.user);
  const { mediaPreviewURI, mediaFile } = useSelector((state) => state.homePage);

  // Getting count of characters and saving it in the
  const getCount = (e) => {
    store.dispatch(updateTweetCharsCount(e.target.value.length));
  };

  const handleSubmitTweet = (e) => {
    e.preventDefault();
    let formData = {
      content: e.target[0].value,
      media: "",
    };

    if (mediaFile === "") {
      store.dispatch(sendTweet(formData));
    } else {
      store.dispatch(sendTweetIncludeMedia(mediaFile, formData));
    }

    e.target[0].value = "";
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmitTweet(e);
      }}
    >
      <div className="border-b border-gray-200 dark:border-dim-200 pb-4 border-l border-r">
        <div className="flex flex-shrink-0 p-4 pb-0">
          <div className="w-12 flex items-top">
            <img
              className="inline-block h-10 w-10 rounded-full"
              src={`${userInfo.photo}`}
              alt=""
            />
          </div>
          <div className="w-full p-2">
            <textarea
              required
              name="content"
              onInput={(e) => {
                getCount(e);
              }}
              maxLength={280}
              rows={5}
              className="dark:text-white basis-0 text-gray-900 placeholder-gray-400 w-full  bg-transparent border-0 focus:outline-none resize-none"
              placeholder="What's happening?"
            ></textarea>
          </div>
        </div>
        {mediaPreviewURI === "" ? null : <MediaPreview />}

        <div className="w-full flex items-top p-2 text-white pl-14">
          <MediaInput />

          <Link
            to="#"
            className="text-blue-400 hover:bg-blue-50 dark:hover:bg-dim-800 rounded-full p-2"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <g>
                <path d="M19 10.5V8.8h-4.4v6.4h1.7v-2h2v-1.7h-2v-1H19zm-7.3-1.7h1.7v6.4h-1.7V8.8zm-3.6 1.6c.4 0 .9.2 1.2.5l1.2-1C9.9 9.2 9 8.8 8.1 8.8c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1 0 1.8-.4 2.4-1.1v-2.5H7.7v1.2h1.2v.6c-.2.1-.5.2-.8.2-.9 0-1.6-.7-1.6-1.6 0-.8.7-1.6 1.6-1.6z"></path>
                <path d="M20.5 2.02h-17c-1.24 0-2.25 1.007-2.25 2.247v15.507c0 1.238 1.01 2.246 2.25 2.246h17c1.24 0 2.25-1.008 2.25-2.246V4.267c0-1.24-1.01-2.247-2.25-2.247zm.75 17.754c0 .41-.336.746-.75.746h-17c-.414 0-.75-.336-.75-.746V4.267c0-.412.336-.747.75-.747h17c.414 0 .75.335.75.747v15.507z"></path>
              </g>
            </svg>
          </Link>

          <Link
            to="#"
            className="text-blue-400 hover:bg-blue-50 dark:hover:bg-dim-800 rounded-full p-2"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <g>
                <path d="M20.222 9.16h-1.334c.015-.09.028-.182.028-.277V6.57c0-.98-.797-1.777-1.778-1.777H3.5V3.358c0-.414-.336-.75-.75-.75s-.75.336-.75.75V20.83c0 .415.336.75.75.75s.75-.335.75-.75v-1.434h10.556c.98 0 1.778-.797 1.778-1.777v-2.313c0-.095-.014-.187-.028-.278h4.417c.98 0 1.778-.798 1.778-1.778v-2.31c0-.983-.797-1.78-1.778-1.78zM17.14 6.293c.152 0 .277.124.277.277v2.31c0 .154-.125.28-.278.28H3.5V6.29h13.64zm-2.807 9.014v2.312c0 .153-.125.277-.278.277H3.5v-2.868h10.556c.153 0 .277.126.277.28zM20.5 13.25c0 .153-.125.277-.278.277H3.5V10.66h16.722c.153 0 .278.124.278.277v2.313z"></path>
              </g>
            </svg>
          </Link>

          <Link
            to="#"
            className="text-blue-400 hover:bg-blue-50 dark:hover:bg-dim-800 rounded-full p-2"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <g>
                <path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path>
                <path d="M12 17.115c-1.892 0-3.633-.95-4.656-2.544-.224-.348-.123-.81.226-1.035.348-.226.812-.124 1.036.226.747 1.162 2.016 1.855 3.395 1.855s2.648-.693 3.396-1.854c.224-.35.688-.45 1.036-.225.35.224.45.688.226 1.036-1.025 1.594-2.766 2.545-4.658 2.545z"></path>
                <circle cx="14.738" cy="9.458" r="1.478"></circle>
                <circle cx="9.262" cy="9.458" r="1.478"></circle>
              </g>
            </svg>
          </Link>

          <Link
            to="#"
            className="text-blue-400 hover:bg-blue-50 dark:hover:bg-dim-800 rounded-full p-2"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <g>
                <path d="M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2z"></path>
                <path d="M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2zM18 2.2h-1.3v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H7.7v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H4.8c-1.4 0-2.5 1.1-2.5 2.5v13.1c0 1.4 1.1 2.5 2.5 2.5h2.9c.4 0 .8-.3.8-.8 0-.4-.3-.8-.8-.8H4.8c-.6 0-1-.5-1-1V7.9c0-.3.4-.7 1-.7H18c.6 0 1 .4 1 .7v1.8c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-5c-.1-1.4-1.2-2.5-2.6-2.5zm1 3.7c-.3-.1-.7-.2-1-.2H4.8c-.4 0-.7.1-1 .2V4.7c0-.6.5-1 1-1h1.3v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5h7.5v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5H18c.6 0 1 .5 1 1v1.2z"></path>
                <path d="M15.5 10.4c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2 3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2zm0 11c-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7 4.7 2.1 4.7 4.7c0 2.5-2.1 4.7-4.7 4.7z"></path>
                <path d="M18.9 18.7c-.1.2-.4.4-.6.4-.1 0-.3 0-.4-.1l-3.1-2v-3c0-.4.3-.8.8-.8.4 0 .8.3.8.8v2.2l2.4 1.5c.2.2.3.6.1 1z"></path>
              </g>
            </svg>
          </Link>
          <ProgressCircle />
          <button className="bg-blue-400 hover:bg-blue-500 text-white rounded-full py-1 px-4  mr-1">
            <span className="font-bold text-sm">Tweet</span>
          </button>
        </div>
      </div>
    </form>
  );
}
