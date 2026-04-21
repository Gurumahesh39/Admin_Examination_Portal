import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Layout/Login.css";
import bgImage from "../assets/loginpage-img.jpg";

function LoginPage() {
  const navigate = useNavigate();

  const [data, setData] = useState({facultyId: "",password: "",});
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

    const facultyId = data.facultyId.trim();
    const password = data.password.trim();

    if (!facultyId || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ facultyId, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Login failed");
        setLoading(false);
        return;
      }

      //VALIDATE TOKEN
      if (!result.token) {
        setError("Invalid server response");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", result.token);

      setSuccess("Login Successful!");

      //clear form
      setData({ facultyId: "", password: "" });

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (err) {
      console.log(err);
      setError("Server error");
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="login-card">
        <h2>Login</h2>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleSubmit}>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;