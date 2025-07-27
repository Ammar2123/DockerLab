import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { Lock, LogIn, Loader2, Eye, EyeOff } from "lucide-react";

const AdminLogin = ({ setIsAdmin }) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth(); // Use the login function from AuthContext

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      return toast.error("Please fill in all fields");
    }

    try {
      setLoading(true);
      // Use the login function from context instead of making API call directly
      const success = await login(formData.username, formData.password);
      
      if (success) {
        toast.success("Login successful!");
        navigate("/admin/home");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(`Login error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      darkMode ? 'bg-surface-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    } transition-colors duration-200 px-4`}>
      <div className="flex-grow flex items-center justify-center">
        <div className={`max-w-md w-full ${
          darkMode ? 'bg-surface-800 shadow-dark-soft' : 'bg-white shadow-soft'
        } rounded-2xl p-8 transition-all duration-200 animate-fade-in`}>
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-full ${
                darkMode ? 'bg-primary-900' : 'bg-primary-100'
              } flex items-center justify-center mb-4`}>
                <Lock size={28} className={darkMode ? 'text-primary-400' : 'text-primary-600'} />
              </div>
            </div>
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-surface-100' : 'text-surface-900'
            }`}>
              Admin Login
            </h2>
            <p className={`mt-2 ${
              darkMode ? 'text-surface-400' : 'text-surface-600'
            }`}>
              Enter your credentials to access the admin portal
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="username" 
                className={`block text-sm font-medium ${
                  darkMode ? 'text-surface-300' : 'text-surface-700'
                } mb-1`}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-surface-700 border-surface-600 text-surface-100 focus:border-primary-500' 
                    : 'border-surface-300 focus:border-primary-500'
                } focus:ring-1 focus:ring-primary-500 focus:outline-none`}
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className={`block text-sm font-medium ${
                  darkMode ? 'text-surface-300' : 'text-surface-700'
                } mb-1`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-surface-700 border-surface-600 text-surface-100 focus:border-primary-500' 
                      : 'border-surface-300 focus:border-primary-500'
                  } focus:ring-1 focus:ring-primary-500 focus:outline-none pr-12`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? 'text-surface-400 hover:text-surface-300' : 'text-surface-500 hover:text-surface-700'
                  } focus:outline-none`}
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`w-full flex items-center justify-center ${
                  darkMode 
                    ? 'bg-primary-600 hover:bg-primary-500' 
                    : 'bg-primary-600 hover:bg-primary-700'
                } text-white py-3 rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  loading ? 'opacity-80 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} className="mr-2" />
                    Login
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className={`text-sm ${
                darkMode 
                  ? 'text-primary-400 hover:text-primary-300' 
                  : 'text-primary-600 hover:text-primary-700'
              } transition-colors`}
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
      
      {/* Added footer */}
      <footer className={`py-8 ${darkMode ? 'bg-surface-900 text-surface-400' : 'bg-transparent text-surface-600'}`}>
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

export default AdminLogin;