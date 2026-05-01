import { useState, useRef } from "react";
import { useNavigate } from "react-router";

function AddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const selectedFile = fileRef.current?.files[0];

    if (!selectedFile) {
      setError("Please select image");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Only image files allowed");
      return;
    }

    try {
      setLoading(true);

      //appending values in formadata
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      formData.append("image", selectedFile);

      //sending post request
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        console.log("❌ Server error:", errData);
        throw new Error(errData.error || "Failed to add user");
      }

      const data = await res.json();
      console.log("✅ User created successfully:", data);

      // ✅ Reset form before navigation (optional but clean)
      setForm({ name: "", email: "", age: "" });
      if (fileRef.current) fileRef.current.value = "";

      window.alert("User added successfully");
    } catch (err) {
      console.log("🔥 Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Add New User</h2>

      {error && <p className="error-msg">{error}</p>}

      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter name"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            required
            placeholder="Enter age"
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            ref={fileRef}
            required
            placeholder="Upload image"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add User"}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;
