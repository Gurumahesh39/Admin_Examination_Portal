import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Performance() {
  const [students, setStudents] = useState([]);
  const [semester, setSemester] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/api/v1/performance?semester=${semester}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch");
          setLoading(false);
          return;
        }

        //SAFE SET
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);

      } catch (err) {
        console.log(err);
        setError("Server error");
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [semester, navigate]);

  //SAFE GRADE CALCULATION
  const calculateGrade = (total) => {
    if (total >= 250) return { grade: "A", color: "success" };
    if (total >= 200) return { grade: "B", color: "primary" };
    if (total >= 150) return { grade: "C", color: "warning" };
    return { grade: "F", color: "danger" };
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Student Performance</h3>

          <select
            className="form-select w-auto"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
          </select>
        </div>

        {/* STATES */}
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}

        {/* Table */}
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Maths</th>
                  <th>Science</th>
                  <th>English</th>
                  <th>Total</th>
                  <th>Grade</th>
                </tr>
              </thead>

              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="7">No data found</td>
                  </tr>
                ) : (
                  students.map((s, index) => {
                    const maths = s.maths || 0;
                    const science = s.science || 0;
                    const english = s.english || 0;

                    const total = maths + science + english;
                    const { grade, color } = calculateGrade(total);

                    return (
                      <tr key={s._id}>
                        <td>{index + 1}</td>
                        <td>{s.name}</td>
                        <td>{maths}</td>
                        <td>{science}</td>
                        <td>{english}</td>
                        <td>{total}</td>
                        <td>
                          <span className={`badge bg-${color}`}>
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Button */}
        <div className="text-end">
          <button className="btn btn-success">
            Download Report
          </button>
        </div>

      </div>
    </div>
  );
}

export default Performance;