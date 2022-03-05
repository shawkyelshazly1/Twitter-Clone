import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { ReactComponent as LoadingComponent } from "../../loading.svg";
import { clearErrors, clearSuccessAlert } from "../../redux/error/error-actions";
import {
  getTFUs,
  getHashtagTweets,
  getTopHashtags,
} from "../../redux/homepage/hompage-actions";
import store from "../../redux/store";
import { loadFollowedUsers } from "../../redux/user/user-actions";
import Tweet from "../smallComponents/Tweet";

export default function HashtagPage() {
  const { isLoading } = useSelector((state) => state.auth);
  const { loadingTweets, tweets } = useSelector((state) => state.homePage);
  const params = useParams();

  useEffect(() => {
    store.dispatch(clearSuccessAlert());
    store.dispatch(clearErrors());
    store.dispatch(getTFUs());
    store.dispatch(loadFollowedUsers());
    store.dispatch(getHashtagTweets(params.hashtagQuery));
    store.dispatch(getTopHashtags());
  }, [params.hashtagQuery]);

  if (isLoading) return <LoadingComponent />;

  return (
    <>
      <div className="flex justify-between items-center border-b px-4 py-3 sticky top-0 bg-white dark:bg-dim-900 border-l border-r border-gray-200 dark:border-gray-700">
        <h2 className="text-gray-800 dark:text-gray-100 font-bold font-sm">
          #{params.hashtagQuery}
        </h2>

        <div>
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-blue-400"
            fill="currentColor"
          >
            <g>
              <path d="M22.772 10.506l-5.618-2.192-2.16-6.5c-.102-.307-.39-.514-.712-.514s-.61.207-.712.513l-2.16 6.5-5.62 2.192c-.287.112-.477.39-.477.7s.19.585.478.698l5.62 2.192 2.16 6.5c.102.306.39.513.712.513s.61-.207.712-.513l2.16-6.5 5.62-2.192c.287-.112.477-.39.477-.7s-.19-.585-.478-.697zm-6.49 2.32c-.208.08-.37.25-.44.46l-1.56 4.695-1.56-4.693c-.07-.21-.23-.38-.438-.462l-4.155-1.62 4.154-1.622c.208-.08.37-.25.44-.462l1.56-4.693 1.56 4.694c.07.212.23.382.438.463l4.155 1.62-4.155 1.622zM6.663 3.812h-1.88V2.05c0-.414-.337-.75-.75-.75s-.75.336-.75.75v1.762H1.5c-.414 0-.75.336-.75.75s.336.75.75.75h1.782v1.762c0 .414.336.75.75.75s.75-.336.75-.75V5.312h1.88c.415 0 .75-.336.75-.75s-.335-.75-.75-.75zm2.535 15.622h-1.1v-1.016c0-.414-.335-.75-.75-.75s-.75.336-.75.75v1.016H5.57c-.414 0-.75.336-.75.75s.336.75.75.75H6.6v1.016c0 .414.335.75.75.75s.75-.336.75-.75v-1.016h1.098c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"></path>
            </g>
          </svg>
        </div>
      </div>

      {loadingTweets ? (
        <LoadingComponent />
      ) : (
        <>
          {tweets.length !== 0 ? (
            tweets.map((tweet) => <Tweet key={tweet.tweet._id} tweet={tweet} />)
          ) : (
            <div className="text-3xl text-black mt-10 pt-10">
              <span>No results for "#{params.hashtagQuery}"</span>
            </div>
          )}{" "}
        </>
      )}
    </>
  );
}
