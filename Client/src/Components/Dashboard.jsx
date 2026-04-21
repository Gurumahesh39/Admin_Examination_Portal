import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");

        // If no token → go login
        if (!token) {
          navigate("/login");
          return;
        }

        setLoading(true);

        const res = await fetch("http://localhost:5000/api/v1/students", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Token expired or invalid
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch data");
          setStudents([]);
          setLoading(false);
          return;
        }

        //Always use DB data
        setStudents(Array.isArray(data) ? data : []);
        setError("");
        setLoading(false);

      } catch (err) {
        console.log("Fetch error:", err);
        setError("Server error");
        setStudents([]);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [navigate]);

  //CALCULATIONS
  const total = students.length;

  const pass = students.filter(
    (s) => s?.status?.toLowerCase() === "pass"
  ).length;

  const fail = students.filter(
    (s) => s?.status?.toLowerCase() === "fail"
  ).length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">

        {/* SIDEBAR */}
        <div className="sidebar">
          <h3 className="logo">
            <i className="bi bi-mortarboard-fill"></i> Portal
          </h3>

          <ul className="menu">

            <li>
              <Link to="/dashboard">
                <i className="bi bi-house-door-fill"></i> Dashboard
              </Link>
            </li>

            <li>
              <Link to="/students">
                <i className="bi bi-people-fill"></i> Students
              </Link>
            </li>

            <li>
              <Link to="/attendance">
                <i className="bi bi-calendar-check-fill"></i> Attendance
              </Link>
            </li>

            <li>
              <Link to="/attendance-history">
                <i className="bi bi-clock-history"></i> Attendance History
              </Link>
            </li>

            <li>
              <Link to="/performance">
                <i className="bi bi-graph-up-arrow"></i> Performance
              </Link>
            </li>

          </ul>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content">

          <h2>
            <i className="bi bi-pie-chart-fill"></i> Dashboard Overview
          </h2>

          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}

          {!loading && !error && (
            <>
              <div className="cards">

                {/* TOTAL */}
                <div
                  className="card-box"
                  onClick={() => navigate("/filtered?filter=all")}
                >
                  <i className="bi bi-people-fill card-icon"></i>
                  <h6>Total Students</h6>
                  <h2>{total}</h2>
                </div>

                {/* PASS */}
                <div
                  className="card-box success"
                  onClick={() => navigate("/filtered?filter=pass")}
                >
                  <i className="bi bi-check-circle-fill card-icon"></i>
                  <h6>Pass Students</h6>
                  <h2>{pass}</h2>
                </div>

                {/* FAIL */}
                <div
                  className="card-box danger"
                  onClick={() => navigate("/filtered?filter=fail")}
                >
                  <i className="bi bi-x-circle-fill card-icon"></i>
                  <h6>Fail Students</h6>
                  <h2>{fail}</h2>
                </div>

              </div>

              {students.length === 0 && (
                <p style={{ marginTop: "15px" }}>No students found</p>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;