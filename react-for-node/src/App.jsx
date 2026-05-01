import { useEffect, useState } from "react";
import { NavLink } from "react-router";

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:3000/users?search=${search}`);

        if (!res.ok) {
          const errData = await res.json();
          console.log("❌ GET error:", errData);
          throw new Error(errData.error || "Failed to fetch users");
        }

        const data = await res.json();
        console.log("✅ Users fetched successfully:", data);

        setUsers(data);
      } catch (err) {
        console.log("🔥 GET Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setDeletingId(id);
      setError("");

      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        console.log("❌ DELETE error:", errData);
        throw new Error(errData.error || "Failed to delete user");
      }

      const data = await res.json();
      console.log("✅ User deleted successfully:", data);

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.log("🔥 DELETE Error:", err.message);
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-container">
      <h2>User List</h2>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={() => setSearch("")}>Clear</button>

      {loading && <p>Loading users...</p>}
      {error && <p className="error-msg">{error}</p>}

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Action</th>
              <th>Edit</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={user?.image || "-"}
                    alt={user.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "10px",
                    }}
                  />
                </td>
                <td>{user?.id || "-"}</td>
                <td>{user?.name || "-"}</td>
                <td>{user?.email || "-"}</td>
                <td>{user?.age || "-"}</td>
                <td>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(user.id)}
                    disabled={deletingId === user.id}
                  >
                    {deletingId === user.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
                <td>
                  <NavLink className="btn-primary" to={`/edit/${user.id}`}>
                    Edit
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
