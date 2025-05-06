import React from "react";

const EditCategory = () => {
  return (
    <section className="form-section">
      <div className="container form-section-container">
        <h2>Edit Category</h2>
        <form action="">
          <input type="text" placeholder="Title" />
          <textarea rows="4" placeholder="Description"></textarea>
          <button type="submit" className="btn">
            Update Category
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditCategory;
