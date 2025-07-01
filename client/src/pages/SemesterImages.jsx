import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import Navbar from '../components/Navbar';

const SemesterImages = () => {
  const { semNumber } = useParams();
  const [dockerImages, setDockerImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageOSMap, setImageOSMap] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axiosInstance.get('/api/labs');
        const filtered = res.data.filter(img => img.semester === `Sem ${semNumber}`);
        setDockerImages(filtered);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };

    fetchImages();
  }, [semNumber]);

  const handleRunCommand = (cmd) => {
    if (!cmd) return alert('❌ Command is missing!');
    if (window.electronAPI?.runDockerCommand) {
      window.electronAPI.runDockerCommand(cmd);
    } else {
      alert('❌ Electron API not available.');
    }
  };

  const handleOSChange = (id, os) => {
    setImageOSMap(prev => ({ ...prev, [id]: os }));
  };

  const getOS = (id) => imageOSMap[id] || 'ubuntu';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pb-12">
      <Navbar isAdmin={false} />
<h1 className="text-3xl font-bold text-center text-indigo-800 mb-6 mt-8">
  Docker Labs Images - Semester {semNumber}
</h1>

      {dockerImages.length === 0 ? (
        <p className="text-center text-gray-500">No labs available for this semester.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {dockerImages.map((img) => (
            <div
              key={img._id}
              onClick={() => setSelectedImage(img)}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 hover:scale-105 transition-transform duration-200 cursor-pointer relative group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {img.subject}
                </span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                  {img.semester}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                {img.ubuntuInstructions || img.windowsInstructions || 'No instructions provided.'}
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="inline-block text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                  OS: Ubuntu & Windows
                </span>
                <span className="text-xs text-gray-400 group-hover:text-indigo-600 transition duration-200">
                  Click to view
                </span>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 relative shadow-lg">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-indigo-700 mb-3">
              {selectedImage.semester} - {selectedImage.subject}
            </h2>

            <div className="flex justify-center mb-4 space-x-2">
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium ${getOS(selectedImage._id) === 'ubuntu'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                  }`}
                onClick={() => handleOSChange(selectedImage._id, 'ubuntu')}
              >
                Ubuntu
              </button>
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium ${getOS(selectedImage._id) === 'windows'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                  }`}
                onClick={() => handleOSChange(selectedImage._id, 'windows')}
              >
                Windows
              </button>
            </div>

            {/* Pull Command */}
            <div className="mb-4">
              <p className="font-medium text-gray-700">Pull Command</p>
              <code className="block bg-gray-100 rounded-lg p-2 text-sm text-gray-800 overflow-x-auto">
                {getOS(selectedImage._id) === 'ubuntu'
                  ? selectedImage.ubuntuPullCommand
                  : selectedImage.windowsPullCommand}
              </code>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      getOS(selectedImage._id) === 'ubuntu'
                        ? selectedImage.ubuntuPullCommand
                        : selectedImage.windowsPullCommand
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={() =>
                    handleRunCommand(
                      getOS(selectedImage._id) === 'ubuntu'
                        ? selectedImage.ubuntuPullCommand
                        : selectedImage.windowsPullCommand
                    )
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Run
                </button>
              </div>
            </div>

            {/* Run Command */}
            <div className="mb-4">
              <p className="font-medium text-gray-700"> Run Command</p>
              <code className="block bg-gray-100 rounded-lg p-2 text-sm text-gray-800 overflow-x-auto">
                {getOS(selectedImage._id) === 'ubuntu'
                  ? selectedImage.ubuntuRunCommand
                  : selectedImage.windowsRunCommand}
              </code>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      getOS(selectedImage._id) === 'ubuntu'
                        ? selectedImage.ubuntuRunCommand
                        : selectedImage.windowsRunCommand
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={() =>
                    handleRunCommand(
                      getOS(selectedImage._id) === 'ubuntu'
                        ? selectedImage.ubuntuRunCommand
                        : selectedImage.windowsRunCommand
                    )
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Run
                </button>
              </div>
            </div>

            {/* Instructions and Notes */}
            <div className="text-sm text-gray-600 mt-3">
              {getOS(selectedImage._id) === 'ubuntu' &&
                selectedImage.ubuntuInstructions && (
                  <p className="mb-1 italic">📝 {selectedImage.ubuntuInstructions}</p>
                )}
              {getOS(selectedImage._id) === 'windows' &&
                selectedImage.windowsInstructions && (
                  <p className="mb-1 italic">📝 {selectedImage.windowsInstructions}</p>
                )}
              {selectedImage.notes && (
                <p className="text-xs text-gray-500">🗒️ {selectedImage.notes}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterImages;
