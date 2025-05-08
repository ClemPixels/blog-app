import React from "react";
import { Link } from "react-router-dom";
import { deleteCategory } from "../services/auth";

const ManageCategories = ({ categories, setCategories }) => {
  const handleDelete = async (categoryId) => {
    try {
      if (!categoryId) return;
      await deleteCategory(categoryId); // Delete category from Firestore
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      ); // Remove category from state
    } catch (error) {
      console.error("Error deleting category:", error.message);
    }
  };
  return (
    <main>
      <h2>Manage Categories</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            categories.map((category, index) => (
              <tr key={index}>
                <td>{category.name}</td>
                <td>
                  <Link to={`/edit-category/${category.id}`} className="btn sm">
                    Edit
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="btn sm danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
};

export default ManageCategories;
