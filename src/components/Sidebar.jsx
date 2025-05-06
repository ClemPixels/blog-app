import { useState } from "react";
import { BsFillPostcardFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { isLogged, role } = useSelector((state) => state.user);
  const [activePath, setActivePath] = useState(""); // Track active link
  const location = useLocation(); // Get the current location

  const handleActive = (path) => {
    setActivePath(path); // Update active path when clicked
  };

  return (
    <aside className="sidebar">
      <ul>
        {isLogged && role !== "admin" ? (
          <>
            <li>
              <Link
                to="/add-post"
                className={activePath === "/add-post" ? "active" : ""}
                onClick={() => handleActive("/add-post")}
              >
                <i className="uil uil-pen"></i>
                <h5>Add Post</h5>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className={
                  activePath === "/dashboard" ||
                  location.pathname === "/dashboard"
                    ? "active"
                    : ""
                }
                onClick={() => handleActive("/dashboard")}
              >
                <i className="uil uil-postcard"></i>
                <h5>Manage Posts</h5>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/add-post"
                className={activePath === "/add-post" ? "active" : ""}
                onClick={() => handleActive("/add-post")}
              >
                <i className="uil uil-pen"></i>
                <h5>Add Post</h5>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className={
                  activePath === "/dashboard" ||
                  location.pathname === "/dashboard"
                    ? "active"
                    : ""
                }
                onClick={() => handleActive("/dashboard")}
              >
                <BsFillPostcardFill />
                <h5>Manage Posts</h5>
              </Link>
            </li>
            <li>
              <Link
                to="/add-user"
                className={activePath === "/add-user" ? "active" : ""}
                onClick={() => handleActive("/add-user")}
              >
                <i className="uil uil-user-plus"></i>
                <h5>Add User</h5>
              </Link>
            </li>
            <li>
              <Link
                to="/manage-users"
                className={
                  activePath === "/manage-users" ||
                  location.pathname === "/manage-users"
                    ? "active"
                    : ""
                }
                onClick={() => handleActive("/manage-users")}
              >
                <i className="uil uil-users-alt"></i>
                <h5>Manage Users</h5>
              </Link>
            </li>
            <li>
              <Link
                to="/add-category"
                className={activePath === "/add-category" ? "active" : ""}
                onClick={() => handleActive("/add-category")}
              >
                <i className="uil uil-edit"></i>
                <h5>Add Category</h5>
              </Link>
            </li>
            <li>
              <Link
                to="/manage-categories"
                className={
                  activePath === "/manage-categories" ||
                  location.pathname === "/manage-categories"
                    ? "active"
                    : ""
                }
                onClick={() => handleActive("/manage-categories")}
              >
                <i className="uil uil-list-ul"></i>
                <h5>Manage Categories</h5>
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
