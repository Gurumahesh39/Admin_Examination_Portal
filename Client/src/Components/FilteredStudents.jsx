import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

function FilteredStudents() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const filter = params.get("filter") || "all";

  //FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        setLoading(true); 

        const res = await fetch("http://localhost:5000/api/v1/students", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Error fetching");
          setLoading(false);
          return;
        }

        // SAFE SET
        const safeData = Array.isArray(data) ? data : [];
        setStudents(safeData);
        setLoading(false);

      } catch (err) {
        console.log(err);
        setError("Server error");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  //FILTER
  useEffect(() => {
    if (!students) return;

    if (filter === "all") {

      setFiltered(students);
    } else {
      const result = students.filter(
        (s) =>
          s?.status?.toLowerCase().trim() === filter.toLowerCase()
      );

      setFiltered(result);
    }
  }, [students, filter]);

  return (
    <div className="filtered-container">

      <div className="filtered-header">
        <h2>
          {filter === "pass" && "✅ Pass Students"}
          {filter === "fail" && "❌ Fail Students"}
          {filter === "all" && "📊 All Students"}
        </h2>

        <button onClick={() => navigate("/dashboard")}>
          ⬅ Back
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p>No students found</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="table-wrapper">

          <table className="filtered-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.branch}</td>
                  <td>
                    <span
                      className={
                        s?.status?.toLowerCase() === "pass"
                          ? "badge pass"
                          : "badge fail"
                      }
                    >
                      {s.status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}

export default FilteredStudents;