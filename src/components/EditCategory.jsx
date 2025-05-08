import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories, updateCategory } from "../services/auth";
import Loader from "./Loader";
import Loading from "./Loading";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = React.useState({ name: "", description: "" });
  const [msg, setMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const getCategory = async () => {
      setMsg("");
      try {
        const data = await getCategories();
        const categoryData = data.find((cat) => cat.id === id);
        if (!categoryData) {
          navigate("/manage-categories");
          return;
        }
        setCategory(categoryData);
      } catch (error) {
        setMsg("Error fetching category:" + error.message);
        console.error("Error fetching category:", error);
      }
    };
    getCategory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      // Assuming updateCategory is a function that updates the category in your database
      await updateCategory(id, category);
      setMsg("Category updated successfully!");
      navigate("/manage-categories");
    } catch (error) {
      setMsg("Error updating category:" + error.message);
      console.error("Error updating category:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="form-section">
      <div className="container form-section-container">
        <h2>Edit Category</h2>
        {msg && <p className="error">{msg}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Title"
            value={category.name}
            onChange={handleChange}
          />
          <textarea
            rows="4"
            placeholder="Description"
            value={category.description}
            name="description"
            onChange={handleChange}
          >
            {category.description}
          </textarea>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="btn">
              {loading ? (
                <p style={{ display: "flex", alignItems: "center" }}>
                  <Loading size="25px" /> Loading...
                </p>
              ) : (
                "Update"
              )}
            </button>
            <button
              type="submit"
              className="btn outline"
              onClick={() => navigate("/manage-categories")}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditCategory;
