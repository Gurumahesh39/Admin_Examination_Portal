import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Students() {
  const navigate = useNavigate();

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Check login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleAddStudent = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = e.target.name.value.trim();
    const branch = e.target.course.value.trim();
    const status = e.target.status.value;

    // ✅ VALIDATION
    if (!name || !branch) {
      setError("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);

      const res = await fetch("http://localhost:5000/api/v1/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, branch, status })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add student");
        setLoading(false);
        return;
      }

      e.target.reset();
      setSuccess("Student added successfully!");

      setLoading(false);

    } catch (err) {
      console.log(err);
      setError("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="student-bg">
      <div className="student-card">

        <h2>🎓 Add Student</h2>

        {error && <p className="text-danger">{error}</p>}

        {success && (
          <div className="success-box">
            <p>{success}</p>
            <button onClick={() => navigate("/dashboard")}>
              Go to Dashboard →
            </button>
          </div>
        )}

        <form onSubmit={handleAddStudent} className="student-form">

          <div className="input-box">
            <i className="bi bi-person-fill"></i>
            <input name="name" placeholder="Student Name" required />
          </div>

          <div className="input-box">
            <i className="bi bi-book-fill"></i>
            <input name="course" placeholder="Branch" required />
          </div>

          <div className="input-box">
            <i className="bi bi-check-circle-fill"></i>
            <select name="status">
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Student"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Students;