import React from "react";

export default function ChatMessageRecieved({ message }) {
  return (
    <div className="flex flex-row gap-4 items-center w-full">
      <img
        className="rounded-full w-10 h-10"
        src={message.sender.photo}
        alt=""
      />

      <h1 className="font-normal ">{message.content}</h1>
    </div>
  );
}
