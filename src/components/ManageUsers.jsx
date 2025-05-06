import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteUserAndPosts, fetchAllUsers } from "../services/auth";
import ConfirmModal from "./ConfirmModal";
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    console.log(" post;", user);
  };

  const handleDelete = async () => {
    try {
      if (!selectedUser) return;
      await deleteUserAndPosts(selectedUser.id); // Delete user from Firestore
      setUsers(users.filter((user) => user.id !== selectedUser.id)); // Remove user from state
      console.log(`User with ID ${selectedUser.id} has been deleted.`);
      setSuccess(`User ${selectedUser.username} deleted successfully`);
      setShowModal(false);
    } catch (error) {
      setError("Failed to delete user");
      console.error("Error deleting user:", error.message);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const userData = await fetchAllUsers();
        console.log("Fetched data: ", userData);
        setUsers(userData);
      } catch (error) {
        setError("Failed to fetch users");
        console.error("Error fetching users: ", error.message);
      }
    };

    getUsers();
  }, []);

  return (
    <main>
      <h2>Manage Users</h2>
      {error && <p className="alert-message error">{error}</p>}
      {success && <p className="alert-message success">{success}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {user.firstName || "Unknown"} {user.lastName || ""}
              </td>
              <td>{user.username || "No Username"}</td>
              <td>
                <Link to={`/edit-users/${user.id}`} className="btn sm">
                  Edit
                </Link>
              </td>
              <td>
                <button
                  onClick={() => handleDeleteClick(user)}
                  className="btn sm danger"
                >
                  Delete
                </button>
              </td>
              <td>{user.role === "admin" ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && selectedUser && (
        <ConfirmModal
          isOpen={showModal}
          title="Confirm Deletion"
          thumbnail={selectedUser.avatar || ""} // Safely access thumbnail
          message={`Are you sure you want to delete "${selectedUser.username}"?`}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </main>
  );
};

export default ManageUsers;
