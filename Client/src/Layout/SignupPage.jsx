import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Layout/Signup.css";
import bgImage from "../assets/Signup-img.jpg";

function Signup() {
  const navigate = useNavigate();

  const [data, setData] = useState({name: "",facultyId: "",password: ""});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; 

    setLoading(true);
    setError("");
    setSuccess("");

    const name = data.name.trim();
    const facultyId = data.facultyId.trim();
    const password = data.password.trim();

    //VALIDATION
    if (!name || !facultyId || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, facultyId, password })
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess("Signup Successful!");

      //clear form
      setData({name: "", facultyId: "", password: ""});
      setTimeout(() => {
        navigate("/login");
      }, 800);

    } catch (err) {
      console.log(err);
      setError("Server error");
      setLoading(false);
    }
  };

  return (
    <div
      className="signup-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="signup-card">
        <h2>Signup</h2>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Faculty Name"
              value={data.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="facultyId"
              placeholder="Faculty ID"
              value={data.facultyId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>

          <button disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;