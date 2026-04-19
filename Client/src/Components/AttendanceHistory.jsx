import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function AttendanceHistory() {
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  //FETCH DATA
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/v1/attendance", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const result = await res.json();

        if (!res.ok) {
          setError(result.message || "Failed to fetch");
          setLoading(false);
          return;
        }

        setData(result);
        setLoading(false);

      } catch {
        setError("Server error");
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [navigate]);

  //START EDIT
  const startEdit = (index) => {
    setEditingIndex(index);
    setEditData([...data[index].students]);
  };

  //HANDLE CHANGE
  const handleChange = (i, field, value) => {
    const updated = [...editData];
    updated[i][field] = value;
    setEditData(updated);
  };

  //SAVE UPDATE
  const saveEdit = async (recordId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/v1/attendance/${recordId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ students: editData })
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      //UPDATE UI
      const updated = [...data];
      updated[editingIndex].students = editData;
      setData(updated);

      setEditingIndex(null);

    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="history-container">

      <div className="history-header">
        <h2>📊 Attendance History</h2>
        <button onClick={() => navigate("/dashboard")}>⬅ Back</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p>No attendance records found</p>
      )}

      {!loading && !error && data.map((record, index) => (
        <div key={record._id} className="history-card">

          {/*FIXED DATE FORMAT */}
          <h3>
            Date:{" "}
            {new Date(record.date).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric"
            })}
          </h3>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {(editingIndex === index ? editData : record.students).map((s, i) => (
                <tr
                  key={i}
                  className={
                    s.status === "Present"
                      ? "row-present"
                      : s.status === "Absent"
                      ? "row-absent"
                      : "row-late"
                  }
                >
                  <td>{i + 1}</td>

                  {/* NAME */}
                  <td>
                    {editingIndex === index ? (
                      <input
                        value={s.name}
                        onChange={(e) =>
                          handleChange(i, "name", e.target.value)
                        }
                      />
                    ) : s.name}
                  </td>

                  {/* BRANCH */}
                  <td>
                    {editingIndex === index ? (
                      <input
                        value={s.branch}
                        onChange={(e) =>
                          handleChange(i, "branch", e.target.value)
                        }
                      />
                    ) : s.branch}
                  </td>

                  {/* STATUS */}
                  <td>
                    {editingIndex === index ? (
                      <select
                        value={s.status}
                        onChange={(e) =>
                          handleChange(i, "status", e.target.value)
                        }
                      >
                        <option>Present</option>
                        <option>Absent</option>
                        <option>Late</option>
                      </select>
                    ) : s.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* BUTTONS */}
          {editingIndex === index ? (
            <button className="save-btn" onClick={() => saveEdit(record._id)}>
              💾 Save
            </button>
          ) : (
            <button onClick={() => startEdit(index)}>
              ✏️ Edit
            </button>
          )}

        </div>
      ))}

    </div>
  );
}

export default AttendanceHistory;