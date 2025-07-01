import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isAdmin }) => {
  const location = useLocation();

  const activeLink = "text-blue-700 border-b-2 border-blue-700 font-semibold";
  const defaultLink = "hover:text-blue-700 transition duration-200";

  const linkStyle = (path, exact = true) => {
    if (exact) {
      return location.pathname === path ? activeLink : defaultLink;
    }
    return location.pathname.startsWith(path) ? activeLink : defaultLink;
  };

  if (isAdmin) {
    return (
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-800">Admin Dashboard</h1>
        <div className="flex gap-6 text-md text-gray-700 font-medium">
          <Link to="/admin/home" className={linkStyle("/admin/home")}>
            Home
          </Link>
          <Link to="/admin/dashboard" className={linkStyle("/admin/dashboard")}>
            Create Lab
          </Link>
          <Link to="/admin/docs" className={linkStyle("/admin/docs")}>
            Create Documentation
          </Link>
          <Link to="/" className="text-red-600 hover:text-red-800 transition">
            Logout
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-blue-800">DockerLab</h1>
      <div className="flex gap-6 text-md text-gray-700 font-medium">
        <Link to="/" className={linkStyle("/")}>Home</Link>
        <Link to="/student" className={linkStyle("/student")}>Labs</Link>
        {/* <Link to="/semesters" className={linkStyle("/semesters")}>Semesters</Link> */}
        <Link to="/student/docs" className={linkStyle("/student/docs")}>Documentation</Link>
        <Link to="/admin/login" className={linkStyle("/admin/login", false)}>
          Admin Portal
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
