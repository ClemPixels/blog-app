import React from "react";
import Avatar1 from "../assets/avatar1.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../services/auth";
import { clearUser } from "../redux/userSlice";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
const Nav = () => {
  const { isLogged, avatar, username } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    try {
      await logout();
      dispatch(clearUser());
      navigate("/signin");
    } catch (error) {
      console.error("Error logging out: ", error.message);
    }
  };

  const handleOpenNav = () => {
    const nav = document.querySelector(".nav-items");
    const openBtn = document.getElementById("open-nav-btn");
    const closeBtn = document.getElementById("close-nav-btn");

    nav.style.display = "flex";
    openBtn.style.display = "none";
    closeBtn.style.display = "block";
  };

  const handleCloseNav = () => {
    const nav = document.querySelector(".nav-items");
    const openBtn = document.getElementById("open-nav-btn");
    const closeBtn = document.getElementById("close-nav-btn");

    nav.style.display = "none";
    openBtn.style.display = "block";
    closeBtn.style.display = "none";
  };
  return (
    <nav>
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          CLEMPIXELS
        </Link>
        <ul className="nav-items">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.href}>{link.name}</Link>
            </li>
          ))}
          {isLogged ? (
            <li className="nav-profile">
              <div className="avatar">
                <img src={avatar || Avatar1} alt="Avatar" />
              </div>
              <ul>
                <li>
                  <Link to="/dashboard">{username}</Link>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link onClick={handleLogout}>Logout</Link>
                </li>
              </ul>
            </li>
          ) : (
            <Link to="/signin" className="login-link">
              Login
            </Link>
          )}
        </ul>
        <button id="open-nav-btn" onClick={handleOpenNav}>
          <FaBars />
        </button>
        <button id="close-nav-btn" onClick={handleCloseNav}>
          <FaXmark />
        </button>
      </div>
    </nav>
  );
};

const navLinks = [
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default Nav;
