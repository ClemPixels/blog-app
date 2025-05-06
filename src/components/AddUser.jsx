import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addUserWithAuthentication,
  uploadToCloudinary,
} from "../services/auth";
import { useSelector } from "react-redux";
// import { v4 as uuidv4 } from "uuid";

const AddUser = () => {
  const { role } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "author",
    avatar: null,
  });

  useEffect(() => {
    // Redirect non-admin users
    if (role !== "admin") {
      alert("You are not authorized to access this page");
      navigate("/dashboard");
    }
  }, [role, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password do not match");
      return;
    }

    try {
      const avatarURL = formData.avatar
        ? await uploadToCloudinary(formData.avatar)
        : null;

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        avatar: avatarURL,
      };

      await addUserWithAuthentication(
        formData.email,
        formData.password,
        userData
      );
      setSuccessMessage("User added successfully!");
      setErrorMessage("");

      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "author",
        avatar: null,
      });

      navigate("/manage-users");
    } catch (error) {
      console.error("Error adding user: ", error.message);
      setErrorMessage("Failed to add user");
    }
  };

  return (
    <section className="form-section">
      <div className="container form-section-container">
        <h2>Add User</h2>
        {errorMessage && (
          <div className="alert-message error">
            <p>{errorMessage}</p>
          </div>
        )}
        {successMessage && (
          <div className="alert-message success">
            <p>{successMessage}</p>
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
            required
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
          <select name="role" value={formData.role} onChange={handleChange}>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
          <div className="form-control">
            <label htmlFor="avatar">Use avatar</label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              name="avatar"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn">
            Add User
          </button>
        </form>
      </div>
    </section>
  );
};

const roles = ["author", "admin"];

export default AddUser;
