const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  runDockerCommand: (os, cmd) => {
    console.log("🔌 Preload sending command:", os, cmd);
    return ipcRenderer.invoke('run-docker-command', { 
      os: os.toString().trim(), 
      cmd: cmd.toString().trim() 
    });
  },
});