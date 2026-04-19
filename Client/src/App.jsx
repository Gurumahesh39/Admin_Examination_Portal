import React from "react";
import {BrowserRouter,Routes,Route,Navigate,useLocation} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Dashboard from "./Components/Dashboard";
import Students from "./Components/Students";
import Attendance from "./Components/Attendance";
import Performance from "./Components/Performance";
import Settings from "./Components/Settings";
import FilteredStudents from "./Components/FilteredStudents";
import AttendanceHistory from "./Components/AttendanceHistory";
import Login from "./Layout/LoginPage";
import Signup from "./Layout/SignupPage";

/*SIMPLE PROTECTED ROUTE */
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

/*MAIN LAYOUT */
function Layout() {
  const location = useLocation();
  //hide navbar on auth pages
  const hideNavbar = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup";
  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
        <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>}/>
        <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>}/>
        <Route path="/attendance-history" element={<PrivateRoute><AttendanceHistory /></PrivateRoute>}/>
        <Route path="/performance" element={<PrivateRoute><Performance /></PrivateRoute>}/>
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>}/>
        <Route path="/filtered" element={<PrivateRoute><FilteredStudents /></PrivateRoute>}/>
        {/*fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

/* APP */
function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;