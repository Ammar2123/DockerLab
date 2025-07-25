import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { FileText, Database, Settings, Server } from "lucide-react";

const AdminHome = ({ setIsAdmin }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-surface-900 text-surface-100' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-surface-900'} transition-colors duration-200`}>
      <Navbar isAdmin={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="text-center mb-12">
          <h1 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-primary-400' : 'text-primary-700'} mb-4`}>
            Admin Dashboard
          </h1>
          <p className={`max-w-2xl mx-auto ${darkMode ? 'text-surface-300' : 'text-surface-600'}`}>
            Manage Docker lab environments, documentation, and more from this central dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Labs Management Card */}
          <Link 
            to="/admin/dashboard"
            className={`${
              darkMode 
                ? 'bg-surface-800 hover:bg-surface-700 border-surface-700' 
                : 'bg-white hover:bg-surface-50 border-surface-200'
            } rounded-xl shadow-md border p-6 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] flex flex-col`}
          >
            <div className={`p-3 rounded-full ${darkMode ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-100 text-primary-700'} self-start mb-4`}>
              <Server size={24} />
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-surface-100' : 'text-surface-900'}`}>
              Manage Labs
            </h2>
            <p className={`${darkMode ? 'text-surface-400' : 'text-surface-600'} mb-4`}>
              Add, edit, or remove Docker lab environments for students.
            </p>
            <div className={`mt-auto pt-4 border-t ${darkMode ? 'border-surface-700' : 'border-surface-200'} text-sm ${darkMode ? 'text-primary-400' : 'text-primary-600'} font-medium`}>
              Go to Labs Management →
            </div>
          </Link>

          {/* Documentation Card */}
          <Link 
            to="/admin/docs"
            className={`${
              darkMode 
                ? 'bg-surface-800 hover:bg-surface-700 border-surface-700' 
                : 'bg-white hover:bg-surface-50 border-surface-200'
            } rounded-xl shadow-md border p-6 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] flex flex-col`}
          >
            <div className={`p-3 rounded-full ${darkMode ? 'bg-accent-900/30 text-accent-400' : 'bg-accent-100 text-accent-700'} self-start mb-4`}>
              <FileText size={24} />
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-surface-100' : 'text-surface-900'}`}>
              Manage Documentation
            </h2>
            <p className={`${darkMode ? 'text-surface-400' : 'text-surface-600'} mb-4`}>
              Upload and manage documentation files for student reference.
            </p>
            <div className={`mt-auto pt-4 border-t ${darkMode ? 'border-surface-700' : 'border-surface-200'} text-sm ${darkMode ? 'text-accent-400' : 'text-accent-600'} font-medium`}>
              Go to Documentation →
            </div>
          </Link>

          {/* Settings/Configuration Card */}
          <div className={`${
            darkMode 
              ? 'bg-surface-800 border-surface-700' 
              : 'bg-white border-surface-200'
          } rounded-xl shadow-md border p-6 transition-all duration-200 flex flex-col opacity-75`}>
            <div className={`p-3 rounded-full ${darkMode ? 'bg-surface-700 text-surface-300' : 'bg-surface-200 text-surface-700'} self-start mb-4`}>
              <Settings size={24} />
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-surface-100' : 'text-surface-900'}`}>
              System Configuration
            </h2>
            <p className={`${darkMode ? 'text-surface-400' : 'text-surface-600'} mb-4`}>
              Configure system settings and user permissions (Coming soon).
            </p>
            <div className={`mt-auto pt-4 border-t ${darkMode ? 'border-surface-700' : 'border-surface-200'} text-sm text-surface-500 font-medium`}>
              Coming soon →
            </div>
          </div>
          
          {/* Database Management Card */}
          <div className={`${
            darkMode 
              ? 'bg-surface-800 border-surface-700' 
              : 'bg-white border-surface-200'
          } rounded-xl shadow-md border p-6 transition-all duration-200 flex flex-col opacity-75`}>
            <div className={`p-3 rounded-full ${darkMode ? 'bg-surface-700 text-surface-300' : 'bg-surface-200 text-surface-700'} self-start mb-4`}>
              <Database size={24} />
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-surface-100' : 'text-surface-900'}`}>
              Database Management
            </h2>
            <p className={`${darkMode ? 'text-surface-400' : 'text-surface-600'} mb-4`}>
              Manage application data and perform database operations (Coming soon).
            </p>
            <div className={`mt-auto pt-4 border-t ${darkMode ? 'border-surface-700' : 'border-surface-200'} text-sm text-surface-500 font-medium`}>
              Coming soon →
            </div>
          </div>
        </div>
      </div>
      
      {/* Added footer */}
      <footer className={`py-8 ${darkMode ? 'bg-surface-900 text-surface-400' : 'bg-white text-surface-600'} border-t ${darkMode ? 'border-surface-800' : 'border-surface-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm mb-3 sm:mb-0">
              Developed at <a 
                href="https://www.apsit.edu.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-500'}`}
              >
                A.P. Shah Institute of Technology, Thane, India
              </a>
            </p>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} DockerLab. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminHome;