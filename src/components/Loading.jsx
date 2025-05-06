import React from "react";
import "../loading.css"; // Import the CSS file

const Loading = ({ size = "50px" }) => {
  return (
    <div className="">
      <div
        className="loading-spinner"
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
};

export default Loading;
