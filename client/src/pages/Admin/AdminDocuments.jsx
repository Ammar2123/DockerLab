import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import axios from "axios";
import Navbar from "../../components/Navbar";

const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [labs, setLabs] = useState([]); // Labs fetched from server
  const [title, setTitle] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [labId, setLabId] = useState("");
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDocuments();
    fetchLabs();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axiosInstance.get("/api/documents");
      setDocuments(res.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const fetchLabs = async () => {
    try {
      const res = await axiosInstance.get("/api/labs");
      setLabs(res.data);
    } catch (error) {
      console.error("Error fetching labs:", error);
    }
  };

  const filteredLabs = labs.filter(
    (lab) => String(lab.semester) === semesterId
  );

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const submitDocument = async () => {
    if (!file || !title || !semesterId || !labId) {
      return alert("All fields are required.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("semesterId", semesterId);
    formData.append("labId", labId);
    formData.append("file", file);

    try {
      await axios.post("/api/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchDocuments();
      setShowForm(false);
      setTitle("");
      setSemesterId("");
      setLabId("");
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const deleteDocument = async (docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await axiosInstance.delete(`/api/documents/${docId}`);
        fetchDocuments();
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar isAdmin={true} />

      <div className="py-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-blue-700 font-bold">
            Manage Documentation
          </h1>
          <button
            className={`${
              showForm ? "bg-red-500" : "bg-blue-600"
            } text-white px-6 py-2 rounded-sm font-medium transition`}
            onClick={() => {
              setShowForm(!showForm);
              setTitle("");
              setSemesterId("");
              setLabId("");
              setFile(null);
            }}
          >
            {showForm ? "Cancel" : "Upload Document"}
          </button>
        </div>

        {/* Modal Dialog */}
        {showForm && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowForm(false)}
            />
            <div className="fixed z-50 inset-0 flex justify-center items-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                >
                  ✕
                </button>

                <h2 className="text-xl font-semibold mb-4">
                  Upload New Document
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitDocument();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-gray-400 rounded p-3 focus:outline-blue-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Semester
                    </label>
                    <select
                      value={semesterId}
                      onChange={(e) => setSemesterId(e.target.value)}
                      required
                      className="w-full border border-gray-400 rounded p-3 focus:outline-blue-400"
                    >
                      <option value="">Select Semester</option>
                      {[...Array(8)].map((_, i) => (
                        <option key={i + 1} value={`Sem ${i + 1}`}>
                          Semester {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Lab
                    </label>
                    <select
                      value={labId}
                      onChange={(e) => setLabId(e.target.value)}
                      required
                      className="w-full border border-gray-400 rounded p-3 focus:outline-blue-400"
                    >
                      <option value="">
                        {semesterId ? "Select Lab" : "Select Semester First"}
                      </option>
                      {filteredLabs.map((lab) => (
                        <option key={lab._id} value={lab._id}>
                          {lab.name || lab.labName || `Lab ${lab._id}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      File (PDF or Image)
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      required
                    />
                    {file && (
                      <p className="text-sm text-gray-600 mt-1">{file.name}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Upload
                  </button>
                </form>
              </div>
            </div>
          </>
        )}

        {/* Documents List */}
        {documents.length === 0 ? (
          <p className="text-gray-500 italic">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-6">
            {documents.map((doc) => (
              <div key={doc._id} className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Semester ID: {doc.semesterId} | Lab ID: {doc.labId}
                </p>
                {doc.fileType === "pdf" ? (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    📄 View PDF
                  </a>
                ) : (
                  <img
                    src={doc.fileUrl}
                    alt="Document"
                    className="mt-2 max-w-xs border rounded"
                  />
                )}
                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() => deleteDocument(doc._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDocuments;
