import React, { useState, useEffect } from "react";
// import your Firebase config
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import Loader from "../components/Loader";
import { db } from "../services/auth";
import { Link, useParams } from "react-router-dom";
import CategoryButtons from "../components/CategoryButtons";

const PostsByCategory = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { category } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Create a Firestore query to filter posts by category
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("category", "==", category));

        const querySnapshot = await getDocs(q);

        const postsWithUserData = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const postData = docSnap.data();

            let userData = null;
            if (postData.createdBy) {
              const userRef = doc(db, "users", postData.createdBy);
              const userSnap = await getDoc(userRef);
              userData = userSnap.exists() ? userSnap.data() : null;
            }

            console.log("postsWithUserData:", {
              id: docSnap.id,
              ...postData,
              user: userData, // attach user info to the post
            });

            return {
              id: docSnap.id,
              ...postData,
              user: userData, // attach user info to the post
            };
          })
        );

        setPosts(postsWithUserData);
      } catch (err) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchPosts();
    }
  }, [category]);

  if (loading) return <Loader />; //<div>Loading posts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <header className="category-title">
        <h2>{category ? category : "All Posts"}</h2>
      </header>

      <section className="posts">
        <div className="container posts-container">
          {posts.length === 0 ? (
            <p>No Post in this category</p>
          ) : (
            posts.map((post) => {
              return (
                <article className="post" key={post.id}>
                  <div className="post-thumbnail">
                    <img src={post.thumbnail} alt={post.title} />
                  </div>
                  <div className="post-info">
                    <Link
                      to={`/category-posts/${post.category}`}
                      className="category-button"
                    >
                      {post.category}
                    </Link>
                    <h3 className="post-title">
                      <a href={`/post/${post.id}`}>{post.title}</a>
                    </h3>
                    <p className="post-body">{post.body}</p>
                    <div className="post-author">
                      <div className="post-author-avatar">
                        <img
                          src={post.user?.avatar}
                          alt={post.user?.username || "Unknown Author"}
                        />
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
                  </div>
                </article>
              );
            })
          )}
        </div>
        <CategoryButtons />
      </section>
    </>
  );
};

export default PostsByCategory;
