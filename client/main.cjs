const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');

/**
 * Helper to get the path to a resource that must be unpacked (e.g. python, scripts) for use by subprocesses
 * Works both in development and in production (ASAR-packed)
 */
function getUnpackedPath(relPath) {
  // If running inside app.asar, use app.asar.unpacked for external (non-js) resources
  if (__dirname.includes('app.asar')) {
    return path.join(process.resourcesPath, 'app.asar.unpacked', relPath);
  }
  return path.join(__dirname, relPath);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const indexPath = path.join(__dirname, 'dist', 'index.html');
  console.log('Trying to load:', indexPath);

  win.loadFile(indexPath);
  // win.webContents.openDevTools();
}

// Helper to get the path of the bundled python executable for each OS (UNPACKED)
function getBundledPythonPath(osType) {
  if (osType === 'windows') {
    const winPython = getUnpackedPath('python/python.exe');
    if (fs.existsSync(winPython)) return winPython;
  } else if (osType === 'macos') {
    const macPython = getUnpackedPath('python/bin/python3');
    if (fs.existsSync(macPython)) return macPython;
  } else if (osType === 'linux' || osType === 'ubuntu') {
    const linuxPython = getUnpackedPath('python/bin/python3');
    if (fs.existsSync(linuxPython)) return linuxPython;
  }
  // Fallback to system python
  return (osType === 'windows') ? 'python' : 'python3';
}

function mapOsType(osString) {
  const osLow = osString.toLowerCase();
  if (osLow.startsWith('win')) return 'windows';
  if (osLow.startsWith('mac')) return 'macos';
  if (osLow.startsWith('linux') || osLow.startsWith('ubuntu')) return 'linux';
  return osLow;
}

app.whenReady().then(createWindow);

ipcMain.handle('run-docker-command', async (_, { os: osRaw, cmd }) => {
  const osType = mapOsType(osRaw);
  const scriptPath = getUnpackedPath('scripts/run_command.py');
  const pythonExec = getBundledPythonPath(osType);

  // Log paths for debugging
  console.log('🟢 Received Docker command:', osType, cmd);
  console.log('[PROD] Python Exec:', pythonExec);
  console.log('[PROD] Script Path:', scriptPath);

  // Ensure both are executable (especially after .deb install)
  try {
    fs.chmodSync(pythonExec, 0o755);
    fs.chmodSync(scriptPath, 0o755);
  } catch (e) {
    console.warn('Could not chmod python or script:', e.message);
  }

  const encodedCmd = JSON.stringify(cmd);

  // Add extra environment variables if needed
  const env = {
    ...process.env,
    PATH: process.env.PATH,
    HOME: process.env.HOME
  };

  // Actually spawn the Python process
  let pythonProcess = spawn(pythonExec, [scriptPath, osType, encodedCmd], {
    detached: true,
    env,
  });

  pythonProcess.stdout.on('data', (data) => {
    console.log(`[PYTHON STDOUT]: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`[PYTHON STDERR]: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`[PYTHON CLOSE]: child process exited with code ${code}`);
  });
});