import ManageUsers from "../components/ManageUsers";
import Sidebar from "../components/Sidebar";

const ManageUsersPage = () => {
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
        <ManageUsers />
      </div>
    </section>
  );
};

export default ManageUsersPage;
