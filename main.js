const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false   // cal per a que el preload pugui usar require('fs') i exposar electronAPI
    },
    title: 'Bombers Test - Generalitat de Catalunya',
    backgroundColor: '#0a0a1a',
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.setMenu(null);

  // Obre els enllaços externs (http/https/mailto) fora de l'app (navegador o client de correu)
  const isExternal = (url) => /^(https?:|mailto:)/i.test(url);
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternal(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (isExternal(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

// Save/load progress
const userDataPath = app.getPath('userData');
const progressFile = path.join(userDataPath, 'progress.json');

ipcMain.handle('load-progress', () => {
  try {
    if (fs.existsSync(progressFile)) {
      return JSON.parse(fs.readFileSync(progressFile, 'utf8'));
    }
  } catch (e) {}
  return null;
});

ipcMain.handle('save-progress', (event, data) => {
  try {
    fs.writeFileSync(progressFile, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
