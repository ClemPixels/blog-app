import React, { useEffect, useState } from "react";

import Avatar3 from "../assets/avatar3.jpg";

import Blog1 from "../assets/avatar1.jpg";
import { getAllPosts, getCategories } from "../services/auth";
import { Link } from "react-router-dom";
// import CategoryButtons from "../components/CategoryButtons";
import Loader from "../components/Loader";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      const allCategories = await getCategories();
      setPosts(allPosts);
      setFilteredPosts(allPosts);
      setCategories(allCategories);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory, posts]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // const handleCategoryClick = (category) => {
  //   setSelectedCategory(category);
  //   if (category === "All") {
  //     setFilteredPosts(posts);
  //   } else {
  //     const filtered = posts.filter((post) => post.category === category);
  //     setFilteredPosts(filtered);
  //   }
  // };

  return (
    <div>
      <section className="search-bar">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="container search-bar-container"
        >
          <div>
            <i className="uil uil-search"></i>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
            />
          </div>
          <button type="submit" className="btn">
            Go
          </button>
        </form>
      </section>

      <section className="category-buttons">
        <div
          className="container category-buttons-container"
          style={{ display: "flex" }}
        >
          <button
            className={`category-button ${
              selectedCategory === "All" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("All")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-button ${
                selectedCategory === cat.name ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section className="posts">
        <div className="container posts-container">
          {loading ? (
            <Loader />
          ) : filteredPosts.length === 0 ? (
            <p>No post available</p>
          ) : (
            filteredPosts.map((post) => (
              <article className="post" key={post.id}>
                <div className="post-thumbnail">
                  <img src={post.thumbnail || Blog1} alt={post.title} />
                </div>
                <div className="post-info">
                  <Link
                    to={`/category-posts/${post.category}`}
                    className="category-button"
                  >
                    {post.category}
                  </Link>
                  <h3 className="post-title">
                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="post-body">{post.body.substring(0, 200)}...</p>
                  <div className="post-author">
                    <div className="post-author-avatar">
                      <img src={post.user?.avatar || Avatar3} alt="" />
                    </div>
                    <div className="post-author-info">
                      <h5>By: {post.user?.username}</h5>
                      <small></small>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* <CategoryButtons /> */}
    </div>
  );
};

export default Blog;
