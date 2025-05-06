import React from "react";
import "../loading.css"; // Import the CSS file
import LoaderGif from "../assets/loader.gif";

const Loader = () => {
  return (
    <div className="loading-overlay">
      <div style={{ width: "100px" }}>
        <img src={LoaderGif} alt="" />
      </div>
    </div>
  );
};

export default Loader;
