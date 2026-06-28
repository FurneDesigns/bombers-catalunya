const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

contextBridge.exposeInMainWorld('electronAPI', {
  loadProgress: () => ipcRenderer.invoke('load-progress'),
  saveProgress: (data) => ipcRenderer.invoke('save-progress', data),
  loadQuestions: () => {
    try {
      const filePath = path.join(__dirname, 'src', 'data', 'questions.json');
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      return null;
    }
  }
});
