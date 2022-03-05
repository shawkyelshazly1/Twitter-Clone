import React from "react";

export default function ChatMessageSent({ message }) {
  return (
    <div className="flex flex-row gap-4 items-center justify-end w-full ">
      <h1 className="font-normal ">{message.content}</h1>
      <img
        className="rounded-full w-10 h-10"
        src={message.sender.photo}
        alt=""
      />
    </div>
  );
}
