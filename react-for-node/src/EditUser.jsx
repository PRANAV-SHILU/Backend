import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function EditUser() {
  const navigate = useNavigate();
  const param = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  const [image, setImage] = useState(""); // separate image state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // image preview
  const getImagePreview = () => {
    if (!image) return "";

    if (typeof image === "string") {
      return image; // old image
    }

    return URL.createObjectURL(image); // new image preview
  };

  // FETCH USER
  useEffect(() => {
    async function fetchINIT() {
      try {
        setLoading(true);

        const res = await fetch(`http://localhost:3000/users/${param.EditID}`);

        if (!res.ok) {
          throw new Error("User not found");
        }

        const data = await res.json();

        console.log("Fetched data:", data);

        setImage(data.image); // store image separately
        delete data.image; // remove from form
        setForm(data); // fill form
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchINIT();
  }, [param.EditID]);

  //  SUBMIT (UPDATE USER)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("age", form.age);

      // Only send image if user selected new one
      if (image instanceof File) {
        formData.append("image", image);
      }

      const res = await fetch(`http://localhost:3000/users/${param.EditID}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update user");
      }

      const data = await res.json();
      console.log("✅ User updated:", data);

      window.alert("User updated successfully");
      navigate("/"); // go back
    } catch (err) {
      console.log("🔥 Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="page-container">
      <h2>Edit User</h2>

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

          {/* Show current image */}
          {image && (
            <img
              src={getImagePreview()}
              alt="user"
              width="100"
              height="100"
              style={{ borderRadius: "10px" }}
            />
          )}

          {/* Upload new image */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Editing..." : "Edit User"}
          </button>

          <button type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
