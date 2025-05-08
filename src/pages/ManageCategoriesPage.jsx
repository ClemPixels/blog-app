import { useEffect, useState } from "react";
import ManageCategories from "../components/ManageCategories";
import Sidebar from "../components/Sidebar";
import { getCategories } from "../services/auth";

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    };

    fetchCategories();
  }, []);
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
        {loading ? (
          <p>Loading categories....</p>
        ) : (
          <ManageCategories
            categories={categories}
            setCategories={setCategories}
          />
        )}
      </div>
    </section>
  );
};

export default ManageCategoriesPage;
