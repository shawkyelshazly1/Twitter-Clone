import React from "react";
import { useSelector } from "react-redux";
import { clearMedia } from "../../redux/homepage/hompage-actions";
import store from "../../redux/store";
import { ReactComponent as CloseButton } from "./remove-cross.svg";

export default function MediaPreview() {
  const { mediaPreviewURI } = useSelector((state) => state.homePage);

  return (
    <div className="relative">
      <CloseButton
        onClick={() => {
          store.dispatch(clearMedia());
        }}
        style={{
          width: "30px",
          position: "absolute",
          top: "7px",
          left: "7px",
          cursor: "pointer",
        }}
      />
      <img className="h-3/4" src={`${mediaPreviewURI}`} alt="ph" />
    </div>
  );
}
