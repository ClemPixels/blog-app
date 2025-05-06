import React, { useEffect, useState } from "react";
import { auth } from "../firebase.config";
import { addPost, getCategories, uploadToCloudinary } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";

const AddPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    body: "",
    featured: false,
    thumbnail: null,
    thumbnailPreview: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: files ? URL.createObjectURL(files[0]) : value,
  //   });
  // };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "thumbnail" && files && files[0]) {
      const file = files[0];

      // Set both preview and actual file
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file), // separate preview field
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.title || !formData.body || !formData.category) {
      setError("All fields are required");
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError("Log in to add post");
        setLoading(false);
        return;
      }

      let thumbnailUrl = null;
      if (formData.thumbnail) {
        thumbnailUrl = await uploadToCloudinary(formData.thumbnail);
      }

      const postData = {
        ...formData,
        thumbnail: thumbnailUrl,
        thumbnailPreview: null,
      };

      await addPost(postData, userId);
      console.log("postData added with data:", postData);
      setSuccess("Post added successfully");
      setFormData({
        title: "",
        category: "",
        body: "",
        featured: false,
        thumbnail: null,
        thumbnailPreview: null,
      });

      navigate("/dashboard");
    } catch (error) {
      console.log("Error adding post", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-section">
      <div className="container form-section-container">
        <h2>Add Post</h2>
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
            placeholder="Title"
            name="title"
            onChange={handleChange}
            value={formData.title}
          />
          <select
            name="category"
            onChange={handleChange}
            value={formData.category}
          >
            {loading ? (
              <option>
                <Loading size="10px" />
                &nbsp;Loading...
              </option>
            ) : (
              <>
                <option value="">-- Select Category --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </>
            )}
          </select>
          <textarea
            name="body"
            onChange={handleChange}
            rows="10"
            placeholder="Body"
            value={formData.body}
          ></textarea>
          <div className="form-control inline">
            <input
              type="checkbox"
              name="featured"
              checked={formData.checked}
              id="is_featured"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  featured: e.target.checked,
                }))
              }
            />
            <label htmlFor="is_featured">Featured</label>
          </div>
          <div className="form-control">
            <label htmlFor="thumbnail">Add Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          {/* Image preview */}
          {formData.thumbnailPreview && (
            <img
              src={formData.thumbnailPreview}
              alt="Thumbnail Preview"
              height="100"
            />
          )}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={loading}
              className="btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading ? (
                <>
                  <Loading size="20px" /> &nbsp; Adding Post...{" "}
                </>
              ) : (
                "Add Post"
              )}
            </button>
            <Link className="btn cancel sm" to={"/dashboard"}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddPost;
