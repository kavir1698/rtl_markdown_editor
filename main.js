const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.loadFile('index.html');

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-file');
          }
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [{ name: 'Markdown', extensions: ['md'] }]
            }).then(result => {
              if (!result.canceled) {
                fs.readFile(result.filePaths[0], 'utf8', (err, data) => {
                  if (err) {
                    console.error("An error occurred reading the file :" + err.message);
                    return;
                  }
                  mainWindow.webContents.send('file-opened', data);
                });
              }
            });
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('save-file-request');
          }
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('save-file', (event, content) => {
  dialog.showSaveDialog(mainWindow, {
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  }).then(result => {
    if (!result.canceled) {
      fs.writeFile(result.filePath, content, (err) => {
        if (err) {
          console.error("An error occurred creating the file " + err.message);
        }
      });
    }
  });
});
