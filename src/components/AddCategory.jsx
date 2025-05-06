import React, { useState } from "react";
import { addCategory, getUserDetails } from "../services/auth";
import { auth } from "../firebase.config";

const AddCategory = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.title || !formData.description) {
      setError("All fields are required");
      return;
    }

    try {
      // Call your Firebase function to add the category

      const user = await getUserDetails(auth.currentUser.uid);
      const userId = auth.currentUser.uid; // Get the current user's ID
      console.log("User ID: ", userId);

      if (!user || !user.role === "admin") {
        setError("You do not have permission to add a category.");
        return;
      }
      await addCategory(formData.title, formData.description, userId);
      setSuccess("Category added successfully!");
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error("Error adding category:", error.message);
      setError("Failed to add category. Please try again.");
    }
  };

  return (
    <section className="form-section">
      <div className="container form-section-container">
        <h2>Add Category</h2>
        {error && (
          <div className="alert-message error">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {success && (
            <div className="alert-message success">
              <p>{success}</p>
            </div>
          )}
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <textarea
            name=""
            id=""
            rows="4"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          >
            Description
          </textarea>
          <button type="submit" className="btn">
            Add Category
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddCategory;
