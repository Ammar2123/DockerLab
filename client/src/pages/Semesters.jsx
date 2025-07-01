// src/pages/Semesters.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Semesters = () => {
  const navigate = useNavigate();

  const handleClick = (sem) => {
    navigate(`/semester/${sem}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar isAdmin={false} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12 text-center text-indigo-800 tracking-wide">
          Select a Semester
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => {
            const sem = index + 1;
            return (
              <div
                key={sem}
                onClick={() => handleClick(sem)}
                className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl border border-indigo-200 text-center p-8 text-lg font-semibold text-blue-700 transition-transform duration-300 hover:scale-105"
              >
                Semester {sem}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Semesters;
