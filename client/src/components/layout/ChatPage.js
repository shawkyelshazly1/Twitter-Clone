import React, { useEffect } from "react";
import { useParams } from "react-router";
import {
  loadActiveConversation,
  loadConversationMessages,
  recieveMessage,
} from "../../redux/conversation/conversation-actions";
import store from "../../redux/store";
import ChatMessageInput from "../smallComponents/ChatMessageInput";
import ChatMessageRecieved from "../smallComponents/ChatMessageRecieved";
import ChatMessageSent from "../smallComponents/ChatMessageSent";
import { ReactComponent as LoadingComponent } from "../../loading.svg";
import { useSelector } from "react-redux";
import s from "underscore.string";
import { Link } from "react-router-dom";

export default function ChatPage() {
  const {
    loadingActiveConversation,
    loadingMessages,
    activeConversation,
    messages,
  } = useSelector((state) => state.conversations);
  const { userInfo } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.notifications);

  const params = useParams();

  useEffect(() => {
    if (socket !== "") {
      socket.on("recieveMessage", (messageData) => {
        store.dispatch(recieveMessage(messageData.content));
      });
    }
    store.dispatch(loadActiveConversation(params.conversationId));
    store.dispatch(loadConversationMessages(params.conversationId));
  }, [params.conversationId, socket]);

  if (loadingActiveConversation) return <LoadingComponent />;

  const recipient = activeConversation.members.find(
    (member) => member._id !== userInfo._id
  );
  return (
    <div className="flex flex-col gap-2 content-center  px-4 py-3 h-full">
      <div className="flex justify-between items-center  py-3 mb-2 sticky top-0 bg-white dark:bg-dim-900  border-gray-200 dark:border-gray-700">
        <h2 className="text-gray-800 dark:text-gray-100 font-bold text-xl font-sans">
          Messages
        </h2>
      </div>
      <div className="flex flex-row gap-4 content-center w-full ">
        <Link to={`/${recipient.username}`}>
          <img
            className="rounded-full w-12 h-12"
            src={recipient.photo}
            alt=""
          />
        </Link>
        <div className="flex flex-col  w-full">
          <h1 className="font-semibold text-lg">{`${s.capitalize(
            recipient.firstName
          )}  ${s.capitalize(recipient.lastName)}`}</h1>

          <p className="text-gray-500 font-normal text-sm ">
            @{recipient.username}
          </p>
        </div>
      </div>
      <div className="max-h-screen overflow-y-scroll justify-end">
        <div className="flex flex-col gap-3 mt-4 mb-4 justify-end px-4 ">
          {loadingMessages ? (
            <LoadingComponent />
          ) : (
            <>
              {messages.map((message) =>
                message.sender._id === userInfo._id ? (
                  <ChatMessageSent key={message._id} message={message} />
                ) : (
                  <ChatMessageRecieved key={message._id} message={message} />
                )
              )}
            </>
          )}
        </div>
      </div>
      <ChatMessageInput />
    </div>
  );
}
