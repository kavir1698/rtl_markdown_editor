const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onFileOpened: (callback) => ipcRenderer.on('file-opened', callback),
  onSaveFileRequest: (callback) => ipcRenderer.on('save-file-request', callback),
  saveFile: (content) => ipcRenderer.send('save-file', content)
});