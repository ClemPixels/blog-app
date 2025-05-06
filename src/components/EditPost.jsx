import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getCategories,
  getPostById,
  updatePost,
  uploadToCloudinary,
} from "../services/auth";
import Loader from "./Loader";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    body: "",
    thumbnail: "",
    featured: false,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const post = await getPostById(id);
      console.log("Fetched Post:", post);
      const fetchedCategories = await getCategories();

      if (post) {
        const matchedCategory = fetchedCategories.find(
          (cat) => cat.name === post.category || cat.id === post.category.id
        );

        console.log("Matched Category:", matchedCategory);

        setFormData({
          ...post,
          category: matchedCategory || "",
        });

        setCategories(fetchedCategories);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "category") {
      // Find the full category object based on selected value (ID)
      const selectedCategory = categories.find((c) => c.id === value);
      setFormData((prev) => ({
        ...prev,
        category: selectedCategory,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: file, // base64 or handle upload separately
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedThumbnail = formData.thumbnail;
    if (formData.thumbnail) {
      updatedThumbnail = await uploadToCloudinary(formData.thumbnail);
    }

    const updatedData = {
      ...formData,
      category: formData.category.name,
      thumbnail: updatedThumbnail,
    };
    await updatePost(id, updatedData);
    alert("Post updated!");
    navigate("/dashboard"); // Redirect back to dashboard
  };

  return (
    <section className="form-section">
      <div className="container form-section-container">
        {loading && <Loader />}
        <h2>Edit Post</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <select
            name="category"
            value={formData.category?.id || ""}
            onChange={handleChange}
          >
            <option value="">-- Select Category --</option>
            {categories.map((category, index) => (
              <option key={index} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <textarea
            name="body"
            rows="10"
            placeholder="Body"
            value={formData.body}
            onChange={handleChange}
          ></textarea>
          <div className="form-control inline">
            <input
              type="checkbox"
              id="is_featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            <label htmlFor="is_featured">Featured</label>
          </div>
          <div className="form-control">
            <label htmlFor="thumbnail">Change Thumbnail</label>
            <input
              type="file"
              id="thumbnail"
              onChange={handleThumbnailChange}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="btn">
              Update Post
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

export default EditPost;
