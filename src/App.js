import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";
import AddCategory from "./components/AddCategory";
import AddUser from "./components/AddUser";
import AddPost from "./components/AddPost";
import EditCategory from "./components/EditCategory";
import EditPost from "./components/EditPost";
import EditUser from "./components/EditUser";
import ManageCategoriesPage from "./pages/ManageCategoriesPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import ErrorPage from "./pages/ErrorPage";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import { checkAuthState } from "./firebase.config";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/userSlice";
import Post from "./pages/Post";
import PostsByCategory from "./pages/PostsByCategory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/services",
        element: <ServicesPage />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },

      {
        path: "/add-category",
        element: <AddCategory />,
      },
      {
        path: "/add-user",
        element: <AddUser />,
      },
      {
        path: "/add-post",
        element: <AddPost />,
      },
      {
        path: "/edit-category",
        element: <EditCategory />,
      },
      {
        path: "/edit-post/:id",
        element: <EditPost />,
      },
      {
        path: "/edit-users",
        element: <EditUser />,
      },
      {
        path: "/manage-categories",
        element: <ManageCategoriesPage />,
      },
      {
        path: "/manage-users",
        element: <ManageUsersPage />,
      },
      {
        path: "/post/:postId",
        element: <Post />,
      },
      {
        path: "/category-posts/:category",
        element: <PostsByCategory />,
      },
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    checkAuthState(dispatch, setUser); // Check for existing auth state
  }, [dispatch]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
