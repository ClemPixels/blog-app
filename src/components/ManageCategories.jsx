import React from "react";
import { Link } from "react-router-dom";

const ManageCategories = ({ categories }) => {
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
                  <Link to="/edit-category" className="btn sm">
                    Edit
                  </Link>
                </td>
                <td>
                  <a href="delete-category.html" className="btn sm danger">
                    Delete
                  </a>
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
