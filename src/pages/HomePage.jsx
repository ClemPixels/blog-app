import React, { useEffect, useState } from "react";
import { getAllPosts } from "../services/auth";
import CategoryButtons from "../components/CategoryButtons";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getAllPosts();

      // Log the fetchedPosts data
      // console.log("Fetched Posts:", fetchedPosts);

      const featured = fetchedPosts.filter((post) => post.featured === true);
      featured.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
      const regularPosts = fetchedPosts.filter(
        (post) => post.featured !== true
      );
      // console.log("regularPosts:", regularPosts);
      setFeaturedPost(featured[0] || null);
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <section className="featured">
        <div className="container featured-container">
          {loading ? (
            <Loader />
          ) : featuredPost ? (
            <>
              <div className="post-thumbnail">
                <img src={featuredPost.thumbnail} alt="" />
              </div>
              <div className="post-info">
                <Link
                  to={`/category-posts/${featuredPost.category}`}
                  className="category-button"
                >
                  {featuredPost.category}
                </Link>
                <h2 className="post-title">
                  <a href={`/post/${featuredPost.id}`}>{featuredPost.title}</a>
                </h2>
                <p className="post-body">{featuredPost.body}</p>
                <div className="post-author">
                  <div className="post-author-avatar">
                    <img src={featuredPost.user.avatar} alt="" />
                  </div>
                  <div className="post-author-info">
                    <h5>By: {featuredPost.user.username}</h5>
                    <small>
                      {featuredPost.createdAt.toDate().toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </small>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>No featured post available</p>
          )}
        </div>
      </section>

      <section className="posts">
        <div className="container posts-container">
          {posts.map((post, index) => (
            <article key={index} className="post">
              <div className="post-thumbnail">
                <img src={post.thumbnail} alt="" />
              </div>
              <div className="post-info">
                <Link
                  to={`/category-posts/${post.category}`}
                  className="category-button"
                >
                  {post.category}
                </Link>
                <h3 className="post-title">
                  <a href={post.link}>{post.title}</a>
                </h3>
                <p className="post-body">{post.body}</p>
                <div className="post-author">
                  <div className="post-author-avatar">
                    <img src={post.user.avatar} alt="" />
                  </div>
                  <div className="post-author-info">
                    <h5>By: {post.user.username}</h5>
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
          ))}
        </div>
      </section>

      <CategoryButtons />
    </div>
  );
};

export default HomePage;
