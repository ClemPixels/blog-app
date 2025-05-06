import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../services/auth"; // make sure you have this service

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) {
      setError("No post available sake of no Id");
      return;
    }

    const fetchPost = async () => {
      try {
        console.log("Post ID from URL:", postId);

        const fetchedPost = await getPostById(postId);
        console.log("post", fetchedPost);
        setPost(fetchedPost);
        setLoading(false);
      } catch (err) {
        setError("Failed to load post.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <section className="singlepost">
      <div className="container singlepost-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="alert-message error">{error}</p>
        ) : !post ? (
          <p>No post found.</p>
        ) : (
          <>
            <h2>{post.title}</h2>

            <div className="post-author">
              <div className="post-author-avatar">
                <img src={post.user?.avatar} alt={post.user?.username} />
              </div>
              <div className="post-author-info">
                <h5>By: {post.user?.username}</h5>
                <small>
                  {post.createdAt.toDate().toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </small>
              </div>
            </div>

            <div className="singlepost-thumbnail">
              <img src={post.thumbnail} alt={post.title} />
            </div>

            {/* Assuming post.body is a long string, split into paragraphs */}
            {post.body.split("\n").map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Post;
