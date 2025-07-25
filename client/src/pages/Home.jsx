import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { ArrowRight, Code, Terminal, BookOpen, ExternalLink, Users } from "lucide-react";

const Home = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-surface-900 text-surface-100' : 'bg-surface-50 text-surface-900'} transition-colors duration-200`}>
      <Navbar isAdmin={false} />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight ${darkMode ? 'text-primary-400' : 'text-primary-700'} mb-6`}>
            Docker Labs Portal
          </h1>
          <p className={`text-lg sm:text-xl ${darkMode ? 'text-surface-300' : 'text-surface-600'} max-w-2xl mx-auto`}>
            Access and manage containerized lab environments for your course work.
            Run Docker commands directly from this application.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/student" 
              className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${
                darkMode 
                  ? 'bg-primary-600 hover:bg-primary-500 text-white' 
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              } transition-colors duration-200`}
            >
              Access Labs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/student/docs" 
              className={`inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md ${
                darkMode 
                  ? 'bg-surface-800 hover:bg-surface-700 text-surface-100 border-surface-700' 
                  : 'bg-white hover:bg-surface-100 text-surface-700 border-surface-300'
              } transition-colors duration-200`}
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-16 ${darkMode ? 'bg-surface-800' : 'bg-surface-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-surface-100' : 'text-surface-900'}`}>
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`${darkMode ? 'bg-surface-700 border-surface-600' : 'bg-white border-surface-200'} rounded-xl shadow p-6 border flex flex-col items-center text-center`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-primary-900 text-primary-300' : 'bg-primary-100 text-primary-700'} mb-4`}>
                <Terminal size={24} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-surface-100' : 'text-surface-900'}`}>
                Run Docker Commands
              </h3>
              <p className={`${darkMode ? 'text-surface-300' : 'text-surface-600'}`}>
                Execute Docker commands directly from the application without using the terminal.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`${darkMode ? 'bg-surface-700 border-surface-600' : 'bg-white border-surface-200'} rounded-xl shadow p-6 border flex flex-col items-center text-center`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-accent-900 text-accent-300' : 'bg-accent-100 text-accent-700'} mb-4`}>
                <Code size={24} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-surface-100' : 'text-surface-900'}`}>
                Lab Environments
              </h3>
              <p className={`${darkMode ? 'text-surface-300' : 'text-surface-600'}`}>
                Access pre-configured lab environments for your courses with one click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`${darkMode ? 'bg-surface-700 border-surface-600' : 'bg-white border-surface-200'} rounded-xl shadow p-6 border flex flex-col items-center text-center`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-primary-900 text-primary-300' : 'bg-primary-100 text-primary-700'} mb-4`}>
                <BookOpen size={24} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-surface-100' : 'text-surface-900'}`}>
                Documentation
              </h3>
              <p className={`${darkMode ? 'text-surface-300' : 'text-surface-600'}`}>
                Access comprehensive documentation and guides for each lab environment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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

export default Home;