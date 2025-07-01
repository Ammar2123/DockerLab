import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const AdminHome = ({setAuth}) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar isAdmin={true} />

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center px-6 py-36 bg-gradient-to-r from-indigo-100 to-indigo-200">
  <h1 className="text-5xl font-extrabold text-indigo-900 mb-4 leading-tight">
    Welcome, <span className="text-indigo-700">Admin</span>
  </h1>
  <p className="text-lg text-gray-700 max-w-2xl mb-8">
    You’re in control. Manage Docker labs and documentation for your students effortlessly.
  </p>
  <Link to="/">
    <button className="px-8 py-3 bg-indigo-700 text-white font-medium rounded-lg shadow hover:bg-indigo-800 transition">
      Go back to Student Portal
    </button>
  </Link>
</section>

      {/* Features */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-indigo-800 mb-12">Admin Powers</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Manage Docker Labs",
                desc: "Add, update, or delete Docker-based labs for any semester or subject.",
              },
              {
                title: "Control Documentation",
                desc: "Create or edit detailed guides with headings, commands, and image support.",
              },
              {
                title: "Student-Friendly Layouts",
                desc: "Ensure students get clean, clickable, and organized labs & instructions.",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-indigo-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-50 to-indigo-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-indigo-900 mb-12">Quick Access</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <Link
              to="/admin/dashboard"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">Manage Labs</h3>
              <p className="text-gray-600">Edit or remove existing labs, add new ones, or categorize by semester.</p>
            </Link>

            <Link
              to="/admin/docs"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">Manage Documentation</h3>
              <p className="text-gray-600">Create, edit, or delete rich documentation with structured content.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8 px-6 mt-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">DockerLab Admin</h3>
            <p className="text-sm text-gray-300">
              Powerful backend for managing educational Docker labs and documents.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm text-gray-200">
              <li><Link to="/admin/dashboard" className="hover:underline">Labs</Link></li>
              <li><Link to="/admin/docs" className="hover:underline">Documentation</Link></li>
              <li><Link to="/admin/create-doc" className="hover:underline">Create Docs</Link></li>
              <li><Link to="/admin/create-lab" className="hover:underline">Create Lab</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Student View</h4>
            <ul className="space-y-1 text-sm text-gray-200">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/student" className="hover:underline">Labs</Link></li>
              <li><Link to="/student/docs" className="hover:underline">Docs</Link></li>
              <li><Link to="/semesters" className="hover:underline">Semesters</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-gray-300 mt-6">
          &copy; {new Date().getFullYear()} DockerLab Admin. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AdminHome;
