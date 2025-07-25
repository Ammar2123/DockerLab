import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; // Make sure this import exists

const Navbar = ({ isAdmin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Access auth context if available
  const { logout } = useAuth() || {};

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if a path is active
  const isActive = (path) => location.pathname === path;

  // Completely replace the logo click handler to use navigate
  const handleLogoClick = (e) => {
    e.preventDefault();
    
    if (isAdmin) {
      navigate("/admin/home");
    } else {
      navigate("/");
    }
  };

  // Handle admin logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Use auth context logout if available
    if (logout) {
      logout();
    }
    
    navigate("/login");
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-30 transition-all duration-200 ${
      scrolled 
        ? 'bg-white/80 dark:bg-surface-900/80 backdrop-blur-md shadow-md py-2'
        : 'bg-white dark:bg-surface-900 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Use a regular button instead of Link */}
          <div className="flex-shrink-0">
            <button 
              onClick={handleLogoClick}
              className="flex items-center focus:outline-none"
              type="button" // Explicitly set type to prevent form submission
            >
              <img 
                src="/vite.svg" 
                alt="DockerLab Logo" 
                className="h-10 w-10 mr-2"
              />
              <span className={`text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent`}>
                DockerLab
              </span>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            {isAdmin ? (
              // Admin Navigation Links
              <>
                <NavLink to="/admin/home" isActive={isActive("/admin/home")}>Home</NavLink>
                <NavLink to="/admin/dashboard" isActive={isActive("/admin/dashboard")}>Labs</NavLink>
                <NavLink to="/admin/docs" isActive={isActive("/admin/docs")}>Documentation</NavLink>
                <NavLink to="/about" isActive={isActive("/about")}>Build Credits</NavLink>
              </>
            ) : (
              // Student Navigation Links
              <>
                <NavLink to="/" isActive={isActive("/")}>Home</NavLink>
                <NavLink to="/student" isActive={isActive("/student")}>Labs</NavLink>
                <NavLink to="/student/docs" isActive={isActive("/student/docs")}>Documentation</NavLink>
                <NavLink to="/about" isActive={isActive("/about")}>Build Credits</NavLink>
              </>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <Link
                to="/admin/login"
                className={`px-4 py-2 rounded-lg text-sm font-medium 
                ${darkMode 
                  ? 'text-surface-200 hover:text-white hover:bg-surface-700' 
                  : 'text-surface-700 hover:text-surface-900 hover:bg-surface-100'
                } transition-colors`}
              >
                Admin
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } md:hidden fixed inset-0 z-40 pt-20 transition-all duration-300 ease-in-out`}
      >
        <div 
          className="absolute inset-0 bg-black bg-opacity-50" 
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        
        <div className={`relative h-full w-64 ml-auto py-6 px-4 ${
          darkMode ? 'bg-surface-900' : 'bg-white'
        } shadow-xl overflow-y-auto transform transition-all duration-300 ease-in-out`}>
          <div className="space-y-2 py-2">
            {isAdmin ? (
              // Admin Mobile Links
              <>
                <MobileNavLink to="/admin/home" isActive={isActive("/admin/home")} onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink to="/admin/dashboard" isActive={isActive("/admin/dashboard")} onClick={() => setMobileMenuOpen(false)}>Labs</MobileNavLink>
                <MobileNavLink to="/admin/docs" isActive={isActive("/admin/docs")} onClick={() => setMobileMenuOpen(false)}>Documentation</MobileNavLink>
                <MobileNavLink to="/about" isActive={isActive("/about")} onClick={() => setMobileMenuOpen(false)}>Build Credits</MobileNavLink>
              </>
            ) : (
              // Student Mobile Links
              <>
                <MobileNavLink to="/" isActive={isActive("/")} onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink to="/student" isActive={isActive("/student")} onClick={() => setMobileMenuOpen(false)}>Labs</MobileNavLink>
                <MobileNavLink to="/student/docs" isActive={isActive("/student/docs")} onClick={() => setMobileMenuOpen(false)}>Documentation</MobileNavLink>
                <MobileNavLink to="/about" isActive={isActive("/about")} onClick={() => setMobileMenuOpen(false)}>Build Credits</MobileNavLink>
              </>
            )}

            {/* Bottom items for mobile */}
            <div className="pt-4 mt-4 border-t border-surface-200 dark:border-surface-700">
              {isAdmin ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-left rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Logout</span>
                </button>
              ) : (
                <MobileNavLink to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                  Admin Portal
                </MobileNavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Desktop Navigation Link
const NavLink = ({ to, children, isActive }) => (
  <Link
    to={to}
    className={`px-3 py-2 mx-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
        : "text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
    }`}
  >
    {children}
  </Link>
);

// Mobile Navigation Link
const MobileNavLink = ({ to, children, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
      isActive
        ? "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
        : "text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
    }`}
  >
    {children}
  </Link>
);

export default Navbar;