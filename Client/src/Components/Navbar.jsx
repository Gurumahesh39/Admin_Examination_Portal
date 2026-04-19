import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  //keep navbar in sync
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // optional backend call (not required for JWT)
      await fetch("http://localhost:5000/api/v1/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

    } catch (err) {
      console.log(err);
    }

    localStorage.removeItem("token");
    setIsLoggedIn(false); 
    navigate("/login");
  };

  return (
    <nav className="main-navbar">

      {/* LOGO */}
      <Link to={isLoggedIn ? "/dashboard" : "/login"} className="logo">
        Teacher Portal
      </Link>

      <div className="nav-links">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-btn login-btn">
              Login
            </Link>
            <Link to="/signup" className="nav-btn signup-btn">
              Signup
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="nav-btn logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;