import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { FileText, Search, AlertCircle, Loader } from "lucide-react";

const StudentDocsPortal = () => {
  const { darkMode } = useTheme();
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get API base URL from your axios configuration or environment
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/documents");
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Get the full document URL
  const getDocumentUrl = (fileUrl) => {
    // If fileUrl already starts with http, it's already a full URL
    if (fileUrl && (fileUrl.startsWith('http://') || fileUrl.startsWith('https://'))) {
      return fileUrl;
    }
    
    // Make sure fileUrl starts with a slash
    const formattedPath = fileUrl && !fileUrl.startsWith('/') ? `/${fileUrl}` : fileUrl;
    
    // Construct the full URL
    return `${API_BASE_URL}${formattedPath}`;
  };

  // Safe filter function to handle undefined values
  const filteredDocuments = documents.filter((doc) => {
    // Add null/undefined checks before calling toLowerCase()
    const docTitle = doc.title ? doc.title.toLowerCase() : '';
    const searchTermLower = searchTerm.toLowerCase();
    
    return docTitle.includes(searchTermLower);
  });

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-surface-900 text-surface-100' : 'bg-surface-50 text-surface-900'}`}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-grow">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-primary-400' : 'text-primary-700'} mb-6`}>
          Laboratory Documents
        </h1>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className={darkMode ? 'text-surface-500' : 'text-surface-400'} />
          </div>
          <input
            type="text"
            className={`block w-full pl-10 pr-3 py-2 rounded-lg
              ${darkMode 
                ? 'bg-surface-800 border-surface-700 text-surface-100 placeholder-surface-500' 
                : 'bg-white border-surface-300 text-surface-900 placeholder-surface-400'} 
              focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className={`h-10 w-10 animate-spin ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
          </div>
        ) : error ? (
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-800'} flex items-center`}>
            <AlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className={`text-center py-16 ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
            {searchTerm 
              ? "No documents matching your search criteria" 
              : "No documents available"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div 
                key={doc._id} 
                className={`rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 hover:shadow-xl 
                  ${darkMode ? 'bg-surface-800' : 'bg-white'}`}
              >
                <div className={`p-5`}>
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-md ${darkMode ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-100 text-primary-600'}`}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className={`font-medium ${darkMode ? 'text-surface-100' : 'text-surface-800'} mb-1`}>
                        {doc.title}
                      </h3>
                      <span className={`text-xs inline-block px-2 py-1 rounded-full 
                        ${darkMode ? 'bg-surface-700 text-surface-300' : 'bg-surface-200 text-surface-700'}`}>
                        {doc.fileType || "Document"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <a
                      href={getDocumentUrl(doc.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full text-center py-2 rounded-md transition
                        ${darkMode 
                          ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                          : 'bg-primary-500 hover:bg-primary-600 text-white'}`}
                    >
                      View Document
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default StudentDocsPortal;