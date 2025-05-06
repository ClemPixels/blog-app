import { Link } from "react-router-dom";

const ManagePost = ({ data, deleteClick }) => {
  return (
    <main className="dashboard-main">
      <h2>Manage Posts</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td>No post available</td>
            </tr>
          ) : (
            data.map((post, index) => (
              <tr key={index}>
                <td>{post.title}</td>
                <td>{post.category}</td>
                <td>
                  <Link to={`/edit-post/${post.id}`} className="btn sm">
                    Edit
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => deleteClick(post)}
                    className="btn sm danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
};

export default ManagePost;
