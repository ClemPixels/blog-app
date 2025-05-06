import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { getUserDetails, login } from "../services/auth";
import Loader from "../components/Loader";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch(); // Initialize Redux dispatch
  const navigate = useNavigate(); // Initialize navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Login the user using Firebase Authentication
      const user = await login(email, password);

      const userDetails = await getUserDetails(user.uid);

      // Dispatch user details to Redux
      dispatch(
        setUser({
          uid: user.uid,
          email: userDetails.email,
          username: userDetails.username,
          avatar: userDetails.avatar,
          role: userDetails.role, // Default or fetched role (update later)
          isLogged: true,
        })
      );

      // Redirect to dashboard or desired page
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      // Change this path as needed
    } catch (error) {
      setError("Invalid email or password"); // Handle login errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-section">
      <div className="container form-section-container">
        {loading && <Loader />}
        <h2>Sign In</h2>
        {error && (
          <div className="alert-message error">
            <p>{error}</p>
          </div>
        )}

        {/* <div className="alert-message success">
          <p>This is an success message</p>
        </div> */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn">
            Sign In
          </button>
          <small>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </small>
        </form>
      </div>
    </section>
  );
};

export default Signin;
