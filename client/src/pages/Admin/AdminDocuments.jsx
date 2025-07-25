import axios from "../../utils/axios";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { FileText, Trash2, Upload, Plus, X, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AdminDocs = () => {
  const { darkMode } = useTheme();
  const [documents, setDocuments] = useState([]);
  const [allLabs, setAllLabs] = useState([]); // Store all labs
  const [filteredLabs, setFilteredLabs] = useState([]); // Store filtered labs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    file: null,
    semesterId: "",
    labId: "",
    description: "", // Add description field
  });
  const [uploading, setUploading] = useState(false);

  // Create hardcoded semester array
  const semesters = [
    { _id: "Sem 1", name: "Semester 1", number: 1 },
    { _id: "Sem 2", name: "Semester 2", number: 2 },
    { _id: "Sem 3", name: "Semester 3", number: 3 },
    { _id: "Sem 4", name: "Semester 4", number: 4 },
    { _id: "Sem 5", name: "Semester 5", number: 5 },
    { _id: "Sem 6", name: "Semester 6", number: 6 },
    { _id: "Sem 7", name: "Semester 7", number: 7 },
    { _id: "Sem 8", name: "Semester 8", number: 8 },
  ];

  useEffect(() => {
    fetchDocuments();
    fetchLabs();
  }, []);

  useEffect(() => {
    // Set body overflow when modal opens
    if (showUploadModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    // Cleanup function to ensure body overflow is reset
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showUploadModal]);

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

  const fetchLabs = async () => {
    try {
      const response = await axios.get("/api/labs");
      setAllLabs(response.data);
    } catch (err) {
      console.error("Error fetching labs:", err);
      toast.error("Failed to load labs");
    }
  };

  // Filter labs when semester changes
  const handleSemesterChange = (e) => {
    const selectedSemesterId = e.target.value;
    
    // Reset lab selection when semester changes
    setUploadForm({
      ...uploadForm,
      semesterId: selectedSemesterId,
      labId: ""
    });
    
    // Filter labs based on selected semester
    if (selectedSemesterId) {
      // Update filter to match the format in the old code
      const labsForSemester = allLabs.filter(lab => String(lab.semester) === selectedSemesterId);
      setFilteredLabs(labsForSemester);
      
      if (labsForSemester.length === 0) {
        toast.info("No labs found for this semester");
      }
    } else {
      setFilteredLabs([]);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/documents/${id}`, { data: { token } });
      toast.success("Document deleted successfully");
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      toast.error("Only PDF and image files are allowed");
      return;
    }

    setUploadForm({
      ...uploadForm,
      file: file,
      name: file.name.split(".")[0], // Set name to filename by default
    });
  };

  const getFileType = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension) ? 'image' : 'pdf';
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      return toast.error("Please select a file to upload");
    }

    // Removed mandatory semester and lab validation

    try {
      setUploading(true);
      const formData = new FormData();
      
      // Only include fields that match the Document schema
      formData.append("title", uploadForm.name);
      formData.append("file", uploadForm.file);
      formData.append("fileType", getFileType(uploadForm.file));
      
      // Only add semester and lab IDs if they are selected
      if (uploadForm.semesterId) {
        formData.append("semesterId", uploadForm.semesterId);
      }
      
      if (uploadForm.labId) {
        formData.append("labId", uploadForm.labId);
      }
      
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      const response = await axios.post("/api/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });

      setUploading(false);
      setShowUploadModal(false);
      setUploadForm({
        name: "", 
        file: null, 
        semesterId: "", 
        labId: "", 
        description: ""
      });
      setDocuments([response.data, ...documents]);
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploading(false);
      
      // Enhanced error reporting
      const errorMessage = error.response?.data?.error || error.message;
      
      if (error.response?.status === 403) {
        toast.error("Permission denied. Please check if you're logged in as admin.");
      } else if (error.response?.status === 401) {
        toast.error("Authentication required. Please log in again.");
      } else if (error.response?.status === 400) {
        toast.error(`Upload failed: ${errorMessage}. Please check all fields are filled correctly.`);
      } else {
        toast.error(`Upload failed: ${errorMessage}`);
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-surface-900 text-surface-100' : 'bg-surface-50 text-surface-900'} transition-colors duration-200`}>
      <Navbar isAdmin={true} />

      <div className="page-container">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-primary-400' : 'text-primary-700'} mb-4 md:mb-0`}>
              Manage Documentation
            </h1>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary px-4 py-2 flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Upload Document
            </button>
          </div>

          {/* Documents List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="skeleton h-28 rounded-xl"></div>
              ))}
            </div>
          ) : error ? (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-800'} flex items-center`}>
              <AlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
          ) : documents.length === 0 ? (
            <div className={`text-center py-12 ${darkMode ? 'bg-surface-800 text-surface-300' : 'bg-surface-100 text-surface-600'} rounded-xl`}>
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-4">No documents found</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary px-4 py-2 inline-flex items-center"
              >
                <Upload size={18} className="mr-2" />
                Upload Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className={`card p-5 hover:shadow-soft-xl animate-fade-in transition-all duration-200`}
                >
                  <div className="flex justify-between">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-100 text-primary-600'} mr-3`}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-surface-100' : 'text-surface-800'}`}>
                          {doc.title}
                        </h3>
                        <div className="flex items-center mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-surface-800 text-surface-300' : 'bg-surface-200 text-surface-700'} mr-2`}>
                            {doc.fileType}
                          </span>
                          <span className={`text-xs ${darkMode ? 'text-surface-500' : 'text-surface-500'}`}>
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteDocument(doc._id)}
                      className={`p-2 rounded-full ${darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-100'} transition-colors`}
                      aria-label="Delete document"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto" 
          aria-labelledby="modal-title" 
          role="dialog" 
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUploadModal(false);
          }}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div 
              className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" 
              aria-hidden="true"
            ></div>
            
            <div 
              className={`relative inline-block align-bottom ${darkMode ? 'bg-surface-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className={`${darkMode ? 'text-surface-400 hover:text-surface-200' : 'text-surface-500 hover:text-surface-700'} focus:outline-none`}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="px-4 pt-5 pb-4 sm:p-6">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-surface-100' : 'text-surface-900'} mb-4`}>
                  Upload New Document
                </h3>
                
                <form onSubmit={handleUploadSubmit}>
                  <div className="mb-4">
                    <label htmlFor="file" className="form-label">Document File*</label>
                    <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                      darkMode 
                        ? 'border-surface-700 hover:border-surface-600' 
                        : 'border-surface-300 hover:border-surface-400'
                    }`}>
                      <div className="space-y-1 text-center">
                        <Upload 
                          className={`mx-auto h-12 w-12 ${darkMode ? 'text-surface-500' : 'text-surface-400'}`} 
                          strokeWidth={1} 
                        />
                        <div className="flex text-sm">
                          <label
                            htmlFor="file-upload"
                            className={`relative cursor-pointer rounded-md font-medium ${
                              darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
                            }`}
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.gif"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className={`pl-1 ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
                            or drag and drop
                          </p>
                        </div>
                        <p className={`text-xs ${darkMode ? 'text-surface-500' : 'text-surface-500'}`}>
                          PDF or image files only (JPG, PNG, GIF)
                        </p>
                      </div>
                    </div>
                    {uploadForm.file && (
                      <div className={`mt-2 text-sm ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                        Selected: {uploadForm.file.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label">Document Title*</label>
                    <input
                      type="text"
                      id="name"
                      className="form-input"
                      placeholder="Enter document title"
                      value={uploadForm.name}
                      onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  {/* Add description field */}
                  <div className="mb-4">
                    <label htmlFor="description" className="form-label">Description*</label>
                    <textarea
                      id="description"
                      className="form-input"
                      placeholder="Enter document description"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      required
                    />
                  </div>
                  
                  {/* Semester dropdown - now optional */}
                  <div className="mb-4">
                    <label htmlFor="semester" className="form-label">Semester (Optional)</label>
                    <select
                      id="semester"
                      className="form-input"
                      value={uploadForm.semesterId}
                      onChange={handleSemesterChange}
                    >
                      <option value="">Select a semester</option>
                      {semesters.map(sem => (
                        <option key={sem._id} value={sem._id}>
                          {sem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Lab dropdown - only shown when semester is selected, but optional */}
                  <div className="mb-6">
                    <label htmlFor="lab" className="form-label">Lab (Optional)</label>
                    <select
                      id="lab"
                      className="form-input"
                      value={uploadForm.labId}
                      onChange={(e) => setUploadForm({ ...uploadForm, labId: e.target.value })}
                      disabled={!uploadForm.semesterId}
                    >
                      <option value="">
                        {!uploadForm.semesterId 
                          ? "First select a semester" 
                          : filteredLabs.length === 0 
                            ? "No labs available for this semester" 
                            : "Select a lab"}
                      </option>
                      {filteredLabs.map(lab => (
                        <option key={lab._id} value={lab._id}>
                          {lab.title || lab.name || `Lab ${lab._id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="btn-secondary px-4 py-2"
                      onClick={() => setShowUploadModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary px-4 py-2 flex items-center"
                      disabled={uploading || !uploadForm.file || !uploadForm.name || !uploadForm.description}
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={18} className="mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={18} className="mr-2" />
                          Upload
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDocs;