import React from "react";

export default function ErrorAlert({ message }) {
  return (
    <div
      className="bg-red-500 font-semibold text-lg   text-white px-4 py-4 rounded-full absolute text-center my-0 mx-auto left-0 right-0 mt-4 w-1/4 z-50"
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
}
