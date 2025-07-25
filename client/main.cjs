const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;

// Store theme preference
let currentTheme = 'light';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'public', 'vite.svg'),
    backgroundColor: currentTheme === 'dark' ? '#111827' : '#ffffff',
    show: false // Don't show until ready
  });

  // In production, load the built app
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    // In development, load from the dev server
    mainWindow.loadURL('http://localhost:5173/');
    mainWindow.webContents.openDevTools();
  }

  // Apply native look to window
  if (process.platform === 'darwin') {
    mainWindow.setVibrancy(currentTheme === 'dark' ? 'ultra-dark' : 'light');
  }

  // Prevent white flash when loading
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  // Re-create window on macOS when dock icon clicked
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Read saved theme from storage
  try {
    if (fs.existsSync(path.join(app.getPath('userData'), 'theme.json'))) {
      const themeData = JSON.parse(fs.readFileSync(
        path.join(app.getPath('userData'), 'theme.json'), 
        'utf8'
      ));
      currentTheme = themeData.theme || 'light';
    }
  } catch (error) {
    console.error('Failed to read theme from storage:', error);
  }
});

// Handle Docker command execution - UPDATED to use Python script
ipcMain.handle('run-docker-command', async (event, osType, command) => {
  return new Promise((resolve, reject) => {
    
    // Path to the Python script
    const scriptPath = path.join(
      app.isPackaged ? process.resourcesPath : __dirname,
      'scripts',
      'run_command.py'
    );

    // Check if Python script exists
    if (!fs.existsSync(scriptPath)) {
      const error = `❌ Python script not found at: ${scriptPath}`;
      console.error(error);
      reject(new Error(error));
      return;
    }

    // Detect Python command (try python3 first, then python)
    const pythonCommands = ['python3', 'python'];
    let pythonCmd = 'python3';

    // Try to find available Python command
    const testPython = (cmd) => {
      return new Promise((resolve) => {
        const testProcess = spawn(cmd, ['--version'], { stdio: 'ignore' });
        testProcess.on('close', (code) => {
          resolve(code === 0);
        });
        testProcess.on('error', () => {
          resolve(false);
        });
      });
    };

    // Find working Python command and execute
    (async () => {
      for (const cmd of pythonCommands) {
        if (await testPython(cmd)) {
          pythonCmd = cmd;
          break;
        }
      }


      // Launch the Python script with detached process
      const process = spawn(pythonCmd, [scriptPath, osType, command], {
        detached: true,  // Allow process to run independently
        stdio: ['ignore', 'pipe', 'pipe']  // Capture stdout/stderr for logging
      });

      let stdout = '';
      let stderr = '';

      // Capture output for debugging
      process.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log(`Python stdout: ${data.toString().trim()}`);
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
        console.error(`Python stderr: ${data.toString().trim()}`);
      });

      // Handle process completion
      process.on('close', (code) => {
        if (code === 0) {
          resolve({ 
            success: true, 
            message: 'Terminal launched successfully',
            stdout: stdout.trim(),
            stderr: stderr.trim() 
          });
        } else {
          const error = `❌ Python script exited with code ${code}. stderr: ${stderr}`;
          console.error(error);
          reject(new Error(error));
        }
      });

      // Handle process errors
      process.on('error', (error) => {
        const errorMsg = `❌ Failed to launch Python script: ${error.message}`;
        console.error(errorMsg);
        reject(new Error(errorMsg));
      });

      // Don't wait for the process since it launches a terminal
      process.unref();

      // Give it a moment to start, then resolve
      setTimeout(() => {
        if (!process.killed) {
        }
      }, 1000);

    })().catch((error) => {
      console.error('❌ Error in Python detection:', error);
      reject(error);
    });
  });
});

// Handle theme changes
ipcMain.on('set-theme', (event, theme) => {
  currentTheme = theme;
  
  // Save theme preference
  try {
    fs.writeFileSync(
      path.join(app.getPath('userData'), 'theme.json'),
      JSON.stringify({ theme })
    );
  } catch (error) {
    console.error('Failed to save theme preference:', error);
  }
  
  // Update window background
  if (mainWindow) {
    mainWindow.setBackgroundColor(theme === 'dark' ? '#111827' : '#ffffff');
    
    // Update vibrancy on macOS
    if (process.platform === 'darwin') {
      mainWindow.setVibrancy(theme === 'dark' ? 'ultra-dark' : 'light');
    }
  }
});

// Get current theme
ipcMain.handle('get-theme', () => currentTheme);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});