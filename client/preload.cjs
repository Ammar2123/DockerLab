const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Run Docker commands
  runDockerCommand: async (os, command) => {
    try {
      return await ipcRenderer.invoke('run-docker-command', os, command);
    } catch (error) {
      console.error('Failed to run Docker command:', error);
      throw error;
    }
  },

  getAssetPath: (filename) => `./assets/${filename}`,
  
  // Theme control
  setTheme: (theme) => {
    ipcRenderer.send('set-theme', theme);
  },
  
  // Get current theme from electron
  getTheme: async () => {
    return await ipcRenderer.invoke('get-theme');
  },
  
  // Identify that we're running in Electron
  isElectron: true,

  // Fix the document URL format to avoid triple slashes
  getDocumentUrl: (fileUrl) => {
    // Remove any leading slashes from fileUrl
    const cleanPath = fileUrl.replace(/^\/+/, '');
    return `docproxy://${cleanPath}`;
  },
  
});