import React from "react";

const EditUser = () => {
  return (
    <section className="form-section">
      <div className="container form-section-container">
        <h2>Edit User</h2>
        <form action="" encType="multipart/form-data">
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Last Name" />
          <select name="" id="">
            {roles.map((role, index) => (
              <option key={index} value={index}>
                {role}
              </option>
            ))}
          </select>
          <button type="submit" className="btn">
            Update User
          </button>
        </form>
      </div>
    </section>
  );
};

const roles = ["Author", "Admin"];

export default EditUser;
