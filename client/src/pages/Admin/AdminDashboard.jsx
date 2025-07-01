import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
  const [dockerImages, setDockerImages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    semester: "",
    subject: "",
    dockerImage: "",
    notes: "",
    commands: {
      ubuntu: { pull: [""], run: [""] },
      windows: { pull: [""], run: [""] },
    },
  });

  const fetchImages = async () => {
    try {
      const res = await axiosInstance.get("/api/labs");
      setDockerImages(res.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.subject,
      semester: form.semester,
      description: form.notes,
      dockerImage: form.dockerImage,
      commands: form.commands,
    };

    try {
      if (editId) {
        await axiosInstance.put(`/api/labs/${editId}`, payload);
        setEditId(null);
      } else {
        await axiosInstance.post("/api/labs", payload);
      }
      fetchImages();
      resetForm();
    } catch (error) {
      console.error("Error submitting image:", error);
    }
  };

  const handleEdit = (image) => {
    setForm({
      semester: image.semester,
      subject: image.name,
      dockerImage: image.dockerImage || "",
      notes: image.notes || "",
      commands: image.commands || {
        ubuntu: { pull: [""], run: [""] },
        windows: { pull: [""], run: [""] },
      },
    });
    setEditId(image._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/labs/${id}`);
      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const resetForm = () => {
    setForm({
      semester: "",
      subject: "",
      dockerImage: "",
      notes: "",
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

  // Prevent scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "auto";
  }, [showForm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      <Navbar isAdmin={true} />
      <div className="max-w-5xl mx-auto py-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">
            Manage Docker Container
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded font-medium transition"
          >
            Add New Image
          </button>
        </div>

        {/* Modal Dialog */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-3xl p-8 rounded-3xl shadow-xl relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                {editId ? "Edit Docker Image" : "Add New Docker Image"}
              </h2>

              {/* Form Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  className="w-full border border-gray-400 rounded p-3 focus:outline-blue-400 "
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                />
                <select
                  required
                  className="border rounded p-3 focus:outline-blue-400 border-gray-400"
                  value={form.semester}
                  onChange={(e) =>
                    setForm({ ...form, semester: e.target.value })
                  }
                >
                  <option value="">Select Semester</option>
                  {[...Array(8).keys()].map((i) => (
                    <option key={i} value={`Sem ${i + 1}`}>{`Sem ${
                      i + 1
                    }`}</option>
                  ))}
                </select>

                <input
                  required
                  className="border border-gray-400 rounded p-3 focus:outline-blue-400 col-span-2"
                  placeholder="Docker Image Name"
                  value={form.dockerImage}
                  onChange={(e) =>
                    setForm({ ...form, dockerImage: e.target.value })
                  }
                />
              </div>

              {/* Commands Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Ubuntu */}
                <div className="p-4 border rounded bg-blue-50">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">
                    Linux (Ubuntu)
                  </h3>
                  <label className="block font-medium mb-1">
                    Pull Commands:
                  </label>
                  {form.commands.ubuntu.pull.map((cmd, idx) => (
                    <div
                      key={`ubuntu-pull-${idx}`}
                      className="flex items-center mb-2 gap-2"
                    >
                      <input
                        required
                        className="w-full border rounded p-2"
                        placeholder={`Pull command ${idx + 1}`}
                        value={cmd}
                        onChange={(e) =>
                          updateCommand("ubuntu", "pull", idx, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeCommandField("ubuntu", "pull", idx)
                        }
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addCommandField("ubuntu", "pull")}
                    className="text-blue-600 text-sm mb-4"
                  >
                    + Add Pull Command
                  </button>

                  <label className="block font-medium mb-1">
                    Run Commands:
                  </label>
                  {form.commands.ubuntu.run.map((cmd, idx) => (
                    <div
                      key={`ubuntu-run-${idx}`}
                      className="flex items-center mb-2 gap-2"
                    >
                      <input
                        className="w-full border rounded p-2"
                        placeholder={`Run command ${idx + 1}`}
                        value={cmd}
                        onChange={(e) =>
                          updateCommand("ubuntu", "run", idx, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeCommandField("ubuntu", "run", idx)}
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addCommandField("ubuntu", "run")}
                    className="text-blue-600 text-sm"
                  >
                    + Add Run Command
                  </button>
                </div>

                {/* Windows */}
                <div className="p-4 border rounded bg-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Windows
                  </h3>
                  <label className="block font-medium mb-1">
                    Pull Commands:
                  </label>
                  {form.commands.windows.pull.map((cmd, idx) => (
                    <div
                      key={`windows-pull-${idx}`}
                      className="flex items-center mb-2 gap-2"
                    >
                      <input
                        className="w-full border rounded p-2"
                        placeholder={`Pull command ${idx + 1}`}
                        value={cmd}
                        onChange={(e) =>
                          updateCommand("windows", "pull", idx, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeCommandField("windows", "pull", idx)
                        }
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addCommandField("windows", "pull")}
                    className="text-blue-600 text-sm mb-4"
                  >
                    + Add Pull Command
                  </button>

                  <label className="block font-medium mb-1">
                    Run Commands:
                  </label>
                  {form.commands.windows.run.map((cmd, idx) => (
                    <div
                      key={`windows-run-${idx}`}
                      className="flex items-center mb-2 gap-2"
                    >
                      <input
                        className="w-full border rounded p-2"
                        placeholder={`Run command ${idx + 1}`}
                        value={cmd}
                        onChange={(e) =>
                          updateCommand("windows", "run", idx, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeCommandField("windows", "run", idx)
                        }
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addCommandField("windows", "run")}
                    className="text-blue-600 text-sm"
                  >
                    + Add Run Command
                  </button>
                </div>
              </div>

              <textarea
                className="w-full border border-gray-400 rounded p-3 mt-6 focus:outline-blue-400"
                placeholder="Additional Notes"
                rows="2"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />

              <div className="mt-6 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold transition"
                >
                  {editId ? "Update Image" : "Add Image"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Docker Image Cards */}
        <div>
          {dockerImages.length === 0 ? (
            <p className="text-gray-500">No Docker images found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dockerImages.map((img) => (
                <div
                  key={img._id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border border-gray-200 transition"
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    {img.semester} - {img.name}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>Docker Image:</strong> {img.dockerImage}
                    </p>
                    <p>
                      <strong>Ubuntu Pull:</strong>{" "}
                      {img.commands?.ubuntu?.pull?.join(", ")}
                    </p>
                    <p>
                      <strong>Ubuntu Run:</strong>{" "}
                      {img.commands?.ubuntu?.run?.join(", ")}
                    </p>
                    <p>
                      <strong>Windows Pull:</strong>{" "}
                      {img.commands?.windows?.pull?.join(", ")}
                    </p>
                    <p>
                      <strong>Windows Run:</strong>{" "}
                      {img.commands?.windows?.run?.join(", ")}
                    </p>
                    {img.notes && (
                      <p>
                        <strong>Notes:</strong> {img.notes}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => handleEdit(img)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(img._id)}
                      className="text-red-600 hover:underline font-medium"
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
    </div>
  );
};

export default AdminDashboard;
