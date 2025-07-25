import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import Navbar from "../../components/Navbar";
import { Laptop2, Search, AlertCircle, Copy, Terminal, X, Filter, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

const StudentLabsPortal = () => {
  const [dockerImages, setDockerImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageOSMap, setImageOSMap] = useState({});
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/labs");
        setDockerImages(res.data);
        setError(null);
      } catch (error) {
        console.error("❌ Failed to fetch images:", error);
        setError("Failed to load lab data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterDropdown && !event.target.closest('.filter-dropdown-container')) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown]);

  const uniqueSemesters = Array.from(
    new Set(dockerImages.map((img) => img.semester))
  ).sort();

  const handleSemesterToggle = (sem) => {
    setSelectedSemesters((prev) =>
      prev.includes(sem) ? prev.filter((s) => s !== sem) : [...prev, sem]
    );
  };

  const handleSelectAll = () => {
    setSelectedSemesters(uniqueSemesters);
  };

  const handleClear = () => {
    setSelectedSemesters([]);
  };

  const getOS = (id) => imageOSMap[id] || "ubuntu";

  const handleOSChange = (id, os) => {
    setImageOSMap((prev) => ({ ...prev, [id]: os }));
  };

  // Updated handleRunCommand function for your React component
// This version works with the direct terminal launch approach

const handleRunCommand = async (cmd) => {
  if (!cmd) {
    toast.error("❌ Command is missing!");
    return;
  }

  try {
    const os = getOS(selectedImage._id);
    
    // Show loading toast
    const loadingToast = toast.loading("🚀 Launching terminal...");
    
    if (window.electronAPI?.runDockerCommand) {
      // Pass the OS type and command as separate parameters
      // The command will be executed directly in the terminal without shell scripts
      await window.electronAPI.runDockerCommand(os, cmd);
      
      // Success feedback
      toast.dismiss(loadingToast);
      toast.success("🖥️ Terminal launched successfully! Check your desktop.", {
        duration: 3000,
        icon: '🎉'
      });
      
    } else {
      toast.dismiss(loadingToast);
      toast.error("❌ Desktop app required. Please run this in the Electron application.", {
        duration: 4000
      });
      console.error("Electron API not available - this feature requires the desktop app");
    }
    
  } catch (error) {
    console.error("Failed to run Docker command:", error);
    
    // More specific error messages
    let errorMessage = "❌ Failed to launch terminal.";
    
    if (error.message.includes('ENOENT')) {
      errorMessage = "❌ Terminal not found. Please install a terminal emulator.";
    } else if (error.message.includes('permission')) {
      errorMessage = "❌ Permission denied. Please check file permissions.";
    } else if (error.message.includes('timeout')) {
      errorMessage = "❌ Command timed out. Please try again.";
    }
    
    toast.error(errorMessage, { duration: 4000 });
  }
};

  const handleCopyCommand = (cmd) => {
    navigator.clipboard.writeText(cmd);
    toast.success("Command copied to clipboard");
  };

  const filteredImages = dockerImages
    .filter((img) => {
      const matchesName = img.name?.toLowerCase().includes(search.toLowerCase());
      const matchesSemester =
        selectedSemesters.length === 0 ||
        selectedSemesters.includes(img.semester);
      return matchesName && matchesSemester;
    })
    .sort((a, b) => {
      // Sort alphabetically by name (A-Z)
      return (a.name || '').localeCompare(b.name || '');
    });

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-sky-100 via-blue-200 to-blue-50 text-gray-800'} transition-colors duration-200`}>
      <Navbar isAdmin={false} />

      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-grow">
        <h1 className={`text-4xl md:text-5xl font-extrabold text-center ${darkMode ? 'text-blue-400' : 'text-blue-900'} mb-10 drop-shadow-md`}>
          Docker Labs Portal
        </h1>

        {/* Search and Filter Bar */}
        <div className="flex justify-center mb-6">
          <div className="w-full md:w-2/3 flex gap-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by lab name..."
                className={`w-full px-5 py-3 pl-10 text-base rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'} shadow-lg focus:ring-2 focus:ring-primary-400 focus:outline-none transition-colors duration-200`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative filter-dropdown-container">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700' 
                    : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
                } ${selectedSemesters.length > 0 ? (darkMode ? 'border-indigo-500' : 'border-indigo-500') : ''}`}
              >
                <Filter size={18} className={selectedSemesters.length > 0 ? 'text-indigo-500' : 'text-gray-400'} />
                <span className="hidden sm:inline">
                  {selectedSemesters.length === 0 
                    ? "Filter" 
                    : selectedSemesters.length === uniqueSemesters.length 
                      ? "All Semesters" 
                      : `${selectedSemesters.length} Selected`}
                </span>
                {selectedSemesters.length > 0 && (
                  <span className={`flex items-center justify-center w-5 h-5 text-xs rounded-full ${
                    darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white'
                  }`}>
                    {selectedSemesters.length}
                  </span>
                )}
              </button>
              
              {showFilterDropdown && (
                <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl z-10 py-2 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      Filter by Semester
                    </h3>
                  </div>
                  
                  <div className="px-2 py-2 max-h-60 overflow-y-auto">
                    {uniqueSemesters.map((sem, idx) => (
                      <div 
                        key={idx}
                        className={`px-4 py-2 rounded-lg flex items-center justify-between cursor-pointer ${
                          darkMode 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleSemesterToggle(sem)}
                      >
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {sem}
                        </span>
                        <div className={`w-5 h-5 rounded flex items-center justify-center ${
                          selectedSemesters.includes(sem)
                            ? darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'
                            : darkMode ? 'border border-gray-600' : 'border border-gray-400'
                        }`}>
                          {selectedSemesters.includes(sem) && (
                            <Check size={14} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="px-4 pt-2 pb-2 border-t border-gray-200 dark:border-gray-700 mt-1 flex gap-2">
                    <button
                      onClick={handleSelectAll}
                      className={`flex-1 text-sm px-3 py-1.5 rounded-lg ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
                    >
                      Select All
                    </button>
                    <button
                      onClick={handleClear}
                      className={`flex-1 text-sm px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'} transition-colors`}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Labs Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-primary-300 dark:bg-primary-700"></div>
              <div className="mt-4 text-gray-500 dark:text-gray-400">Loading labs...</div>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center py-10">
            <div className="flex items-center text-red-500 dark:text-red-400">
              <AlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        ) : filteredImages.length === 0 ? (
          <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} italic py-10`}>
            No matching labs found.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredImages.map((img) => (
              <div
                key={img._id}
                onClick={() => setSelectedImage(img)}
                className={`${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                    : 'bg-white border-gray-100 hover:bg-gray-50'
                } rounded-xl shadow-lg p-6 border hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer animate-fadeIn`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Laptop2 className={`${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} px-2 py-1 rounded-full bg-opacity-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    {img.semester}
                  </span>
                </div>
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                  {img.name}
                </h3>
                {img.description && (
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                    {img.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center px-4">
          <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl relative animate-fadeIn transition-colors duration-200`}>
            <button
              onClick={() => setSelectedImage(null)}
              className={`absolute top-4 right-4 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-500'} text-2xl font-bold`}
            >
              <X size={24} />
            </button>

            <h2 className={`text-2xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'} mb-4`}>
              {selectedImage.semester} - {selectedImage.name}
            </h2>

            <div className="flex justify-center gap-2 mb-6">
              {["ubuntu", "windows"].map((os) => (
                <button
                  key={os}
                  className={`px-4 py-1 rounded-full text-sm font-semibold shadow-sm transition ${
                    getOS(selectedImage._id) === os
                      ? darkMode 
                        ? 'bg-indigo-700 text-white' 
                        : 'bg-indigo-600 text-white'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handleOSChange(selectedImage._id, os)}
                >
                  {os.charAt(0).toUpperCase() + os.slice(1)}
                </button>
              ))}
            </div>

            {["pull", "run"].map((type) => {
              const os = getOS(selectedImage._id);
              const commandArray = selectedImage?.commands?.[os]?.[type] || [];

              return (
                <div className="mb-5" key={type}>
                  <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1 capitalize`}>
                    {type} Command{commandArray.length > 1 ? "s" : ""}
                  </p>

                  {commandArray.length === 0 ? (
                    <p className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No {type} commands available.
                    </p>
                  ) : (
                    commandArray.map((cmd, idx) => (
                      <div key={idx} className="mb-3">
                        <code className={`truncate block ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl p-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'} overflow-x-auto shadow-inner`}>
                          {cmd}
                        </code>
                        <div className="flex gap-3 mt-1">
                          <button
                            onClick={() => handleCopyCommand(cmd)}
                            className={`flex items-center gap-1 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-1 rounded-lg text-sm transition-colors`}
                          >
                            <Copy size={14} />
                            Copy
                          </button>
                          <button
                            onClick={() => handleRunCommand(cmd)}
                            className={`flex items-center gap-1 ${darkMode ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-4 py-1 rounded-lg text-sm transition-colors`}
                          >
                            <Terminal size={14} />
                            Run
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}

            {selectedImage.description && (
              <div className={`mt-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Description</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedImage.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer - added to match Home.jsx */}
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

export default StudentLabsPortal;