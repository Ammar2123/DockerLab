import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import Navbar from "../../components/Navbar";
import { Trash2, Edit, Plus, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const [dockerImages, setDockerImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [form, setForm] = useState({
    semester: "",
    subject: "",
    dockerImage: "",
    description: "",
    commands: {
      ubuntu: { pull: [""], run: [""] },
      windows: { pull: [""], run: [""] },
    },
  });

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/labs");
      setDockerImages(res.data);
      
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load labs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
  // Validate form
  if (!form.subject || !form.semester) {
    return toast.error("Subject and semester are required");
  }

  try {
    setSubmitLoading(true);
    
    const payload = {
      name: form.subject,
      semester: form.semester, // CHANGED: Send 'semester' instead of 'semesterId'
      description: form.description,
      dockerImage: form.dockerImage,
      commands: form.commands,
    };

    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Authentication token missing. Please log in again.");
      setSubmitLoading(false);
      return;
    }

    if (editId) {
      const response = await axiosInstance.put(`/api/labs/${editId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Lab updated successfully");
    } else {
      const response = await axiosInstance.post("/api/labs", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Lab created successfully");
    }
    
    await fetchImages();
    resetForm();
  } catch (error) {
    console.error("Error submitting lab:", error);
    console.error("Error response:", error.response?.data);
    toast.error(error.response?.data?.error || "Failed to save lab");
  } finally {
    setSubmitLoading(false);
  }
};

  const handleEdit = (image) => {
    setForm({
      semester: image.semester,
      subject: image.name,
      dockerImage: image.dockerImage || "",
      description: image.description || "",
      commands: image.commands || {
        ubuntu: { pull: [""], run: [""] },
        windows: { pull: [""], run: [""] },
      },
    });
    setEditId(image._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lab?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/api/labs/${id}`, { data: { token } });
      toast.success("Lab deleted successfully");
      fetchImages();
    } catch (error) {
      console.error("Error deleting lab:", error);
      toast.error("Failed to delete lab");
    }
  };

  const resetForm = () => {
    setForm({
      semester: "",
      subject: "",
      dockerImage: "",
      description: "",
      commands: {
        ubuntu: { pull: [""], run: [""] },
        windows: { pull: [""], run: [""] },
      },
    });
    setEditId(null);
    setShowForm(false);
  };

  const updateCommand = (os, type, index, value) => {
    const updated = { ...form };
    updated.commands[os][type][index] = value;
    setForm(updated);
  };

  const addCommandField = (os, type) => {
    const updated = { ...form };
    updated.commands[os][type].push("");
    setForm(updated);
  };

  const removeCommandField = (os, type, index) => {
    const updated = { ...form };
    updated.commands[os][type].splice(index, 1);
    setForm(updated);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") resetForm();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Set body overflow when modal opens
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    // Cleanup function to ensure body overflow is reset
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showForm]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800'} transition-colors duration-200`}>
      <Navbar isAdmin={true} />
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            Manage Docker Containers
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className={`flex items-center gap-2 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-lg font-medium transition-colors`}
          >
            <Plus size={18} />
            Add New Lab
          </button>
        </div>

        {/* Lab Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow p-6 animate-pulse`}>
                <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : dockerImages.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-lg mb-4">No Docker labs found.</p>
            <button
              onClick={() => setShowForm(true)}
              className={`${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-5 py-2 rounded-lg inline-flex items-center gap-2`}
            >
              <Plus size={18} />
              Create Your First Lab
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dockerImages.map((img) => (
              <div
                key={img._id}
                className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow hover:shadow-lg border transition-all animate-fadeIn`}
              >
                <div className="flex justify-between">
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-2`}>
                    {img.name}
                  </h3>
                  <span className={`text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} px-2 py-1 rounded-full`}>
                    {img.semester}
                  </span>
                </div>
                
                <div className={`space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {img.dockerImage && (
                    <p>
                      <strong>Docker Image:</strong> {img.dockerImage}
                    </p>
                  )}
                  
                  {img.description && (
                    <p className="line-clamp-2">
                      <strong>Description:</strong> {img.description}
                    </p>
                  )}
                  
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="font-medium mb-1">Commands:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="font-medium text-primary-600 dark:text-primary-400">Ubuntu</p>
                        <p>Pull: {(img.commands?.ubuntu?.pull?.length || 0)} cmd(s)</p>
                        <p>Run: {(img.commands?.ubuntu?.run?.length || 0)} cmd(s)</p>
                      </div>
                      <div>
                        <p className="font-medium text-primary-600 dark:text-primary-400">Windows</p>
                        <p>Pull: {(img.commands?.windows?.pull?.length || 0)} cmd(s)</p>
                        <p>Run: {(img.commands?.windows?.run?.length || 0)} cmd(s)</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleEdit(img)}
                    className={`flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium`}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(img._id)}
                    className={`flex items-center gap-1 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} font-medium`}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto" 
            aria-labelledby="modal-title" 
            role="dialog" 
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) resetForm();
            }}
          >
            <div className="flex items-center justify-center min-h-screen">
              <div 
                className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" 
                aria-hidden="true"
              ></div>
              
              <div 
                className={`relative inline-block align-bottom ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} focus:outline-none`}
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="px-6 pt-5 pb-6">
                  <div className="text-center mb-6">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {editId ? "Edit Docker Lab" : "Add New Docker Lab"}
                    </h3>
                  </div>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                          Subject/Lab Name*
                        </label>
                        <input
                          required
                          className={`w-full border rounded-lg px-3 py-2 ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                              : 'border-gray-300 focus:border-blue-500'
                          } focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                          placeholder="e.g., Operating System Lab"
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                          Semester*
                        </label>
                        <select
                          required
                          className={`w-full border rounded-lg px-3 py-2 ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                              : 'border-gray-300 focus:border-blue-500'
                          } focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                          value={form.semester}
                          onChange={(e) => setForm({ ...form, semester: e.target.value })}
                        >
                          <option value="">Select Semester</option>
                          {[...Array(8).keys()].map((i) => (
                            <option key={i} value={`Sem ${i + 1}`}>{`Sem ${i + 1}`}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        Docker Image
                      </label>
                      <input
                        className={`w-full border rounded-lg px-3 py-2 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'border-gray-300 focus:border-blue-500'
                        } focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                        placeholder="e.g., ubuntu:latest"
                        value={form.dockerImage}
                        onChange={(e) => setForm({ ...form, dockerImage: e.target.value })}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        Description
                      </label>
                      <textarea
                        className={`w-full border rounded-lg px-3 py-2 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'border-gray-300 focus:border-blue-500'
                        } focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                        placeholder="Lab description"
                        rows="2"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                    </div>
                    
                    {/* Commands Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Ubuntu */}
                      <div className={`p-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-100'}`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-2`}>
                          Linux (Ubuntu)
                        </h3>
                        
                        <CommandSection
                          os="ubuntu"
                          type="pull"
                          commands={form.commands.ubuntu.pull}
                          updateCommand={updateCommand}
                          addCommand={addCommandField}
                          removeCommand={removeCommandField}
                          darkMode={darkMode}
                        />
                        
                        <CommandSection
                          os="ubuntu"
                          type="run"
                          commands={form.commands.ubuntu.run}
                          updateCommand={updateCommand}
                          addCommand={addCommandField}
                          removeCommand={removeCommandField}
                          darkMode={darkMode}
                        />
                      </div>

                      {/* Windows */}
                      <div className={`p-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                          Windows
                        </h3>
                        
                        <CommandSection
                          os="windows"
                          type="pull"
                          commands={form.commands.windows.pull}
                          updateCommand={updateCommand}
                          addCommand={addCommandField}
                          removeCommand={removeCommandField}
                          darkMode={darkMode}
                        />
                        
                        <CommandSection
                          os="windows"
                          type="run"
                          commands={form.commands.windows.run}
                          updateCommand={updateCommand}
                          addCommand={addCommandField}
                          removeCommand={removeCommandField}
                          darkMode={darkMode}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-center gap-4">
                      <button
                        type="submit"
                        disabled={submitLoading}
                        className={`flex items-center gap-2 ${
                          darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white px-6 py-2 rounded-lg font-semibold transition-colors ${
                          submitLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {submitLoading ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            {editId ? "Update Lab" : "Add Lab"}
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={resetForm}
                        className={`${
                          darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                        } px-6 py-2 rounded-lg font-semibold transition-colors`}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Command Section Component
const CommandSection = ({ os, type, commands, updateCommand, addCommand, removeCommand, darkMode }) => (
  <div className="mb-4">
    <label className={`block font-medium mb-1 capitalize ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
      {type} Commands:
    </label>
    
    {commands.map((cmd, idx) => (
      <div key={`${os}-${type}-${idx}`} className="flex items-center mb-2 gap-2">
        <input
          className={`w-full border rounded px-3 py-2 text-sm ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500' 
              : 'border-gray-300 focus:border-blue-500'
          } focus:ring-1 focus:ring-blue-500 focus:outline-none`}
          placeholder={`${type} command ${idx + 1}`}
          value={cmd}
          onChange={(e) => updateCommand(os, type, idx, e.target.value)}
        />
        
        {commands.length > 1 && (
          <button
            type="button"
            onClick={() => removeCommand(os, type, idx)}
            className={`p-1 rounded-full ${darkMode ? 'text-red-400 hover:bg-gray-600' : 'text-red-500 hover:bg-gray-200'}`}
          >
            <X size={16} />
          </button>
        )}
      </div>
    ))}
    
    <button
      type="button"
      onClick={() => addCommand(os, type)}
      className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} mt-1`}
    >
      + Add {type} Command
    </button>
  </div>
);

export default AdminDashboard;