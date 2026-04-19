import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    notifications: false
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  //Check login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  //Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  //Save settings
  const handleSave = async () => {
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/v1/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Update failed");
        return;
      }

      setSuccess("Settings updated successfully");

    } catch (err) {
      console.log(err);
      setError("Server error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <h3 className="fw-bold mb-4">Settings</h3>

        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}

        <div className="row">

          {/* Profile Settings */}
          <div className="col-md-6">
            <h5 className="mb-3 text-primary">Profile Settings</h5>

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Settings */}
          <div className="col-md-6">
            <h5 className="mb-3 text-primary">Change Password</h5>

            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="form-control"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-control"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>
          </div>

        </div>

        {/* Notification Settings */}
        <div className="mt-4">
          <h5 className="mb-3 text-primary">Notifications</h5>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="emailNotifications"
              name="notifications"
              checked={form.notifications}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="emailNotifications">
              Enable Email Notifications
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-end mt-4">
          <button className="btn btn-primary px-4" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;