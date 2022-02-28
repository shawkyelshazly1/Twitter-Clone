import React from "react";
import { ReactComponent as CloseButton } from "./remove-cross.svg";

export default function MediaPreview({ mediaURI, clearMedia }) {
  return (
    <div className="relative">
      <CloseButton
        onClick={() => {
          clearMedia();
        }}
        style={{
          width: "30px",
          position: "absolute",
          top: "7px",
          left: "7px",
          cursor: "pointer",
        }}
      />
      <img className="h-3/4" src={`${mediaURI}`} alt="ph" />
    </div>
  );
}
