import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorGif from "../assets/404.gif";

const ErrorPage = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(7);

  useEffect(() => {
    if (count > 0) {
      const interval = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [count]);

  useEffect(() => {
    // Redirect to the home page after 5 seconds
    const timer = setTimeout(() => {
      navigate(-1); // You can change this to redirect to a different route
    }, 7000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      <img
        style={{
          width: "30rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        src={ErrorGif}
        alt="ErrorGif"
      />
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <p>Redirecting to the previous page in {count} seconds...</p>
      <Link to="/">Go Back to Home</Link>
    </div>
  );
};

export default ErrorPage;
