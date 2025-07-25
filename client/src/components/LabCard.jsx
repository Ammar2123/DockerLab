import React, { useState } from 'react';

const LabCard = ({ image }) => {
  const [osTab, setOsTab] = useState('linux');
  const [sourceTab, setSourceTab] = useState('server');

  // Dummy data (replace with props later)
  const lab = {
    title: "Networking Lab",
    description: "A pre-configured Node.js development environment with npm, yarn, and common development tools.",
    tags: ['nodejs', 'javascript', 'development'],
    repository: "registry.example.com/nodejs-dev",
    lastUpdated: "4/5/2025",
    commands: {
      linux: {
        server: "docker pull registry.example.com/nodejs-dev:latest && docker run -it nodejs-dev",
        local: "docker run -it ./nodejs-dev.tar"
      },
      macos: {
        server: "docker pull registry.example.com/nodejs-dev-macos:latest && docker run -it nodejs-dev-macos",
        local: "docker run -it ./nodejs-dev-macos.tar"
      },
      windows: {
        server: "docker pull registry.example.com/nodejs-dev-win && docker run -it nodejs-dev-win",
        local: "docker run -it ./nodejs-dev-win.tar"
      }
    },
    instructions: "This command will pull the image from the server repository and run it on your system. Make sure you have Docker installed and running on your system before executing these commands."
  };

  const command = lab.commands[osTab][sourceTab];

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4 max-w-4xl mx-auto mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={image}
          alt="Lab"
          className="w-full md:w-1/3 object-cover rounded-xl h-52"
        />
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{lab.title}</h2>
          <p className="text-gray-600">{lab.description}</p>
          <div className="flex flex-wrap gap-2">
            {lab.tags.map((tag, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            Repository: <a href={`https://${lab.repository}`} target="_blank" className="text-blue-600 underline">{lab.repository}</a>
            <br />
            Last Updated: {lab.lastUpdated}
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-3 mb-3">
          {['linux', 'macos', 'windows'].map(os => (
            <button
              key={os}
              className={`px-3 py-1 rounded-full text-sm ${
                osTab === os ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setOsTab(os)}
            >
              {os.charAt(0).toUpperCase() + os.slice(1)}
            </button>
          ))}
          {['server', 'local'].map(src => (
            <button
              key={src}
              className={`px-3 py-1 rounded-full text-sm ${
                sourceTab === src ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSourceTab(src)}
            >
              {src === 'server' ? 'Pull from Server' : 'Run from Local Repository'}
            </button>
          ))}
        </div>

        <div className="bg-black text-green-300 p-3 rounded-lg font-mono text-sm overflow-auto relative">
          <span>{command}</span>
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => navigator.clipboard.writeText(command)}
            >
              Copy
            </button>
            <button
              className="bg-yellow-500 text-white px-2 py-1 rounded"
              onClick={() => {
                if (window.electronAPI?.runDockerCommand) {
                  // Pass both the OS and the command to the function
                  window.electronAPI.runDockerCommand(osTab, command);
                } else {
                  alert('❌ Electron API not available.');
                }
              }}
            >
              Run
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mt-3 text-gray-700 text-sm">
          <strong>Instructions:</strong> <br />
          {lab.instructions}
        </div>
      </div>
    </div>
  );
};

export default LabCard;