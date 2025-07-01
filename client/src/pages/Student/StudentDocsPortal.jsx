import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import Navbar from "../../components/Navbar";
const StudentDocsPortal = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);

  useEffect(() => {
    axiosInstance.get("/api/documents").then((res) => {
      setDocuments(res.data);
      if (res.data.length > 0) setSelectedDocId(res.data[0]._id); // select first doc by default
    });
  }, []);

  const selectedDoc = documents.find((doc) => doc._id === selectedDocId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar isAdmin={false} />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 h-screen overflow-y-auto bg-white shadow-md border-r p-4 sticky top-0">
          <h2 className="text-xl font-semibold mb-4">Documentation</h2>
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc._id}
                onClick={() => setSelectedDocId(doc._id)}
                className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${
                  selectedDocId === doc._id ? "bg-blue-200 font-medium" : ""
                }`}
              >
                {doc.contentBlocks.find((b) => b.type === "heading")?.value ||
                  "Untitled"}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {selectedDoc ? (
            <div className="bg-white p-6 rounded shadow">
              {selectedDoc.contentBlocks.map((f, i) => (
                <div key={i} className="mb-4">
                  {f.type === "heading" && (
                    <h2 className="text-2xl font-bold border-b pb-2 mb-2">
                      {f.value}
                    </h2>
                  )}
                  {f.type === "content" && (
                    <p className="text-gray-700">{f.value}</p>
                  )}
                  {f.type === "command" && (
                    <div className="bg-gray-100 p-3 rounded flex justify-between items-center">
                      <code className="text-sm">{f.value}</code>
                      <button
                        onClick={() => navigator.clipboard.writeText(f.value)}
                        className="ml-4 px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                  {f.type === "image" && (
                    <img
                      src={f.value}
                      alt="Document"
                      className="mt-2 max-w-md rounded border"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Select a document from the sidebar.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDocsPortal;
