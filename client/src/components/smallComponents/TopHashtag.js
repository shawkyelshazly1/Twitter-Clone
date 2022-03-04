import React from "react";
import { Link } from "react-router-dom";

export default function TopHashtag({ hashtag }) {
  return (
    <Link to={`/hashtag/${hashtag.content}`}>
      <div className="text-blue-400 text-sm font-normal p-3 border-b border-gray-200 dark:border-dim-200 hover:bg-gray-100 dark:hover:bg-dim-300 cursor-pointer transition duration-350 ease-in-out">
        <h2 className="font-bold text-md text-gray-800 dark:text-white">
          #{hashtag.content}
        </h2>
        <p className="text-xs text-gray-400">{hashtag.tweetsCount} Tweets</p>
      </div>
    </Link>
  );
}
