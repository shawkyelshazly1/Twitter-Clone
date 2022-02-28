import React from "react";
import { useSelector } from "react-redux";

export default function ProgressCircle({ charsCount }) {
  const { tweetCharsCount } = useSelector((state) => state.homePage);

  const progressStyle = {
    transform: `rotate(${tweetCharsCount / 1.55}1deg)`,
  };

  const progressStyleYellow = {
    transform: `rotate(${tweetCharsCount / 1.55}1deg)`,
    backgroundColor: "#ffcc00",
  };

  const progressStyleRed = {
    transform: `rotate(${tweetCharsCount / 1.55}1deg)`,
    backgroundColor: "#cc3300",
  };

  return (
    <div className="circle-wrap mr-5 my-auto">
      <div className="circle">
        <div className="mask full" style={progressStyle}>
          {(() => {
            if (tweetCharsCount / 280 > 0.7 && tweetCharsCount / 280 < 0.9) {
              return <div className="fill" style={progressStyleYellow}></div>;
            } else if (tweetCharsCount / 280 >= 0.9) {
              return <div className="fill" style={progressStyleRed}></div>;
            } else {
              return <div className="fill" style={progressStyle}></div>;
            }
          })()}
        </div>
        <div className="mask half">
          {(() => {
            if (tweetCharsCount / 280 > 0.7 && tweetCharsCount / 280 < 0.9) {
              return <div className="fill" style={progressStyleYellow}></div>;
            } else if (tweetCharsCount / 280 >= 0.9) {
              return <div className="fill" style={progressStyleRed}></div>;
            } else {
              return <div className="fill" style={progressStyle}></div>;
            }
          })()}
        </div>
        <div className="inside-circle"></div>
      </div>
    </div>
  );
}
