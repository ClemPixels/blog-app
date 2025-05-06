import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  saveUserToDatabase,
  signUp,
  uploadToCloudinary,
} from "../services/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import Loader from "../components/Loader";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Handle file inputs
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!formData.email) {
      setError("Email required");
    } else if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      console.log("Avatar file:", formData.avatar);
      console.log("Is file instanceof File?", formData.avatar instanceof File);

      let avatarUrl = null;
      if (formData.avatar) {
        avatarUrl = await uploadToCloudinary(formData.avatar);
      }

      // Call your Firebase signup function
      const userCredential = await signUp(formData.email, formData.password);
      const user = userCredential.user;
      const uid = user.uid;
      console.log("UID: ", uid);
      console.log("User: ", user);
      console.log("User data: ", formData);

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        role: "author",
      };

      if (avatarUrl) userData.avatar = avatarUrl;

      await saveUserToDatabase(uid, userData);
      console.log("Data sent to Firestore:", uid, userData);
      dispatch(setUser({ uid, ...userData }));
      setError(""); // Clear error

      setSuccess("Signup successful!");
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatar: null,
      });

      navigate("/signin");

      console.log("User successfully signed up and saved to firestore");
    } catch (error) {
      console.error("Error signing up:", error.message);
      setError(error.message); // Display error from Firebase
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-section">
      <div className="container form-section-container">
        {loading && <Loader />}
        <h2>Sign Up</h2>
        {error && (
          <div className="alert-message error">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="alert-message success">
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Create Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <div className="form-control">
            <label htmlFor="avatar">Use avatar</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn">
            Sign Up
          </button>
          <small>
            Already have an account? <Link to="/signin">Sign In</Link>
          </small>
        </form>
      </div>
    </section>
  );
};

export default Signup;
