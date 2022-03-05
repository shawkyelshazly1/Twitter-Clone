import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import s from "underscore.string";

export default function UserChatBox({ conversation }) {
  const { userInfo } = useSelector((state) => state.user);
  const recipient = conversation.members.find(
    (member) => member._id !== userInfo._id
  );
  return (
    <Link to={`/messages/${conversation._id}`}>
      <div className="flex flex-row gap-4 content-center w-full">
        <img className="rounded-full w-14 h-14" src={recipient.photo} alt="" />
        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-row w-full">
            <h1 className="font-semibold text-lg">{`${s.capitalize(
              recipient.firstName
            )}  ${s.capitalize(recipient.lastName)}`}</h1>
            <p className="ml-14 text-gray-500  ">Apr 23, 2017</p>
          </div>
          <p className="text-gray-500 font-normal text-sm mb-2">
            Here shoould be last message .....
          </p>
        </div>
      </div>
    </Link>
  );
}
