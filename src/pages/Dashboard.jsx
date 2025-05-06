import { useEffect, useState } from "react";
import ManagePost from "../components/ManagePost";
import Sidebar from "../components/Sidebar";
import { deletePost, getPosts } from "../services/auth";
import { auth } from "../firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userPosts = await getPosts(user.uid);
        setPost(userPosts);
      } else {
        console.log("User not logged in");
        setPost([]);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  useEffect(() => {
    if (selectedPost) {
      console.log("Selected post for deletion:", selectedPost); // This will log the selected post once it's set
    }
  }, [selectedPost]);

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
    console.log(" post;", post);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedPost) return; // Guard clause to ensure post exists
      await deletePost(selectedPost.id);
      setPost((prev) => prev.filter((p) => p.id !== selectedPost.id));
      setSuccess("Post deleted successfully!");
    } catch (error) {
      setError("Error deleting post.");
      console.error("Error deleting post:", error);
    } finally {
      setShowModal(false);
      setSelectedPost(null);
    }
  };

  return (
    <section className="dashboard">
      <div className="container dashboard-container">
        <button id="show-sidebar-btn" className="sidebar-toggle">
          <i className="uil uil-angle-right-b"></i>
        </button>
        <button id="hide-sidebar-btn" className="sidebar-toggle">
          <i className="uil uil-angle-left-b"></i>
        </button>
        <Sidebar />
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
        {loading ? (
          <Loader /> //<p>Loading posts...</p>
        ) : (
          <ManagePost data={post} deleteClick={handleDeleteClick} />
        )}
      </div>
      {showModal && selectedPost && (
        <ConfirmModal
          isOpen={showModal}
          title="Confirm Deletion"
          thumbnail={selectedPost.thumbnail || ""} // Safely access thumbnail
          message={`Are you sure you want to delete "${selectedPost.title}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowModal(false);
            setSelectedPost(null);
          }}
        />
      )}
    </section>
  );
};

export default Dashboard;
