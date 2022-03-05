import React from "react";
import s from "underscore.string";
import { Link } from "react-router-dom";
import store from "../../redux/store";
import { likeTweet, disLikeTweet } from "../../redux/homepage/hompage-actions";
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";
const reactStringReplace = require("react-string-replace");

export default function Tweet({ tweet }) {
  const { socket } = useSelector((state) => state.notifications);
  //Replacing hashtags with Links to hashtag page
  let adjustedContent = reactStringReplace(
    tweet.tweet.content,
    /#(\w+)/g,
    (match, i) => (
      <Link key={match + i} to={`/hashtag/${match}`} className="text-blue-500">
        #{match}
      </Link>
    )
  );

  // Replacing mentions with Link to profile
  if (tweet.tweet.entities.mentions.length > 0) {
    tweet.tweet.entities.mentions.forEach((mention) => {
      adjustedContent = reactStringReplace(
        adjustedContent,
        `@${mention}`,
        (match, i) => (
          <Link key={match + i} to={`/${mention}`} className="text-blue-700">
            {match}
          </Link>
        )
      );
    });
  }

  return (
    <div className="border-b border-gray-200 dark:border-dim-200 hover:bg-gray-100 dark:hover:bg-dim-300 cursor-pointer transition duration-350 ease-in-out pb-4 border-l border-r">
      <div className="flex flex-shrink-0 p-4 pb-0">
        <Link
          to={`/${tweet.authorInfo.username}`}
          className="flex-shrink-0 group block"
        >
          <div className="flex items-top">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src={`${tweet.authorInfo.photo}`}
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="flex items-center text-base leading-6 font-medium text-gray-800 dark:text-white">
                {`${s.capitalize(tweet.authorInfo.firstName)}  ${s.capitalize(
                  tweet.authorInfo.lastName
                )}`}
                <svg
                  viewBox="0 0 24 24"
                  aria-label="Verified account"
                  fill="currentColor"
                  className="w-4 h-4 ml-1 text-blue-500 dark:text-white"
                >
                  <g>
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path>
                  </g>
                </svg>
                <span className="ml-1 text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150">
                  @{tweet.authorInfo.username} .{" "}
                  {format(parseISO(tweet.tweet.createdAt, 1), "MMM d")}
                </span>
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div className="pl-16">
        <p className="text-base width-auto font-medium text-gray-800 dark:text-white flex-shrink">
          {adjustedContent}
        </p>

        {tweet.tweet.media !== "" ? (
          <div className="flex my-3 mr-2 rounded-2xl border border-gray-600">
            <img className="rounded-2xl" src={`${tweet.tweet.media}`} alt="" />
          </div>
        ) : (
          <div className="my-3"></div>
        )}

        <div className="flex">
          <div className="w-full">
            <div className="flex items-center">
              <div className="flex-1 flex items-center text-gray-800 dark:text-white text-xs  hover:text-blue-400 dark:hover:text-blue-400 transition duration-350 ease-in-out">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <g>
                    <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                  </g>
                </svg>
                12.3 k
              </div>
              <div className="flex-1 flex items-center text-gray-800 dark:text-white text-xs hover:text-green-400 dark:hover:text-green-400 transition duration-350 ease-in-out">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <g>
                    <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>
                  </g>
                </svg>
                14 k
              </div>
              <div className="flex-1 flex items-center text-gray-800 dark:text-white text-xs  hover:text-red-600 dark:hover:text-red-600 transition duration-350 ease-in-out">
                {tweet.tweet.isLiked ? (
                  <svg
                    onClick={() => {
                      store.dispatch(disLikeTweet(tweet.tweet._id));
                    }}
                    viewBox="0 -17 100 100"
                    fill="#E81C4F"
                    className="w-9 h-9"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M38.723,12c-7.187,0-11.16,7.306-11.723,8.131C26.437,19.306,22.504,12,15.277,12C8.791,12,3.533,18.163,3.533,24.647 C3.533,39.964,21.891,55.907,27,56c5.109-0.093,23.467-16.036,23.467-31.353C50.467,18.163,45.209,12,38.723,12z" />
                  </svg>
                ) : (
                  <svg
                    onClick={() => {
                      store.dispatch(
                        likeTweet(tweet.tweet._id, socket, tweet.authorInfo._id)
                      );
                    }}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 mr-2 "
                  >
                    <g>
                      <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
                    </g>
                  </svg>
                )}

                {tweet.tweet.tweetStats.likesCount === "undefined"
                  ? 0
                  : tweet.tweet.tweetStats.likesCount}
              </div>
              <div className="flex-1 flex items-center text-gray-800 dark:text-white text-xs  hover:text-blue-400 dark:hover:text-blue-400 transition duration-350 ease-in-out">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <g>
                    <path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></path>
                    <path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
