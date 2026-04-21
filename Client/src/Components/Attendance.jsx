import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Attendance() {
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [students, setStudents] = useState([
    { name: "", branch: "", status: "Present" },
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const addStudent = () => {
    setStudents([...students, { name: "", branch: "", status: "Present" }]);
  };

  // Remove row
  const removeStudent = (index) => {
    const updated = students.filter((_, i) => i !== index);
    setStudents(updated);
  };

  // Handle input change
  const handleInputChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  };

  // Save attendance
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!date) {
      setError("Please select date");
      return;
    }

    if (students.some((s) => !s.name || !s.branch)) {
      setError("Fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:5000/api/v1/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, students }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Failed to save");
        return;
      }

      setSuccess("Saved Successfully!");

      //Reset form
      setDate("");
      setStudents([{ name: "", branch: "", status: "Present" }]);
      navigate("/Dashboard")
    } catch (err) {
      console.log(err);
      setError("Server error");
    }
  };

  return (
    <div className="attendance-container">
      <div className="attendance-card">
        {/* HEADER */}
        <div className="attendance-header">
          <h3>📅 Attendance Section</h3>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* ALERTS */}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={i}>
                <td>{i + 1}</td>

                <td>
                  <input
                    value={s.name}
                    placeholder="Enter name"
                    onChange={(e) =>
                      handleInputChange(i, "name", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    value={s.branch}
                    placeholder="Enter branch"
                    onChange={(e) =>
                      handleInputChange(i, "branch", e.target.value)
                    }
                  />
                </td>

                <td>
                  <select
                    value={s.status}
                    onChange={(e) =>
                      handleInputChange(i, "status", e.target.value)
                    }
                  >
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Late</option>
                  </select>
                </td>

                <td>
                  <button onClick={() => removeStudent(i)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* BUTTONS */}
        <div className="attendance-actions">
          <div className="left-actions">
            <button onClick={addStudent}>+ Add</button>
          </div>

          <div className="right-actions">
            <button onClick={handleSubmit}>Save</button>
            <button onClick={() => navigate("/dashboard")}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
