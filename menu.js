// menu.js
const { Menu, dialog } = require('electron');
const fs = require('fs');

function createMenu(mainWindow) {
  const template = [
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
          label: 'Open File',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [{ name: 'Markdown', extensions: ['md'] }]
            });
            if (!result.canceled) {
              const content = fs.readFileSync(result.filePaths[0], 'utf8');
              mainWindow.webContents.send('file-opened', content);
            }
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('save-file');
          }
        },
        {
          label: 'Save As',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow, {
              filters: [{ name: 'Markdown', extensions: ['md'] }]
            });
            if (!result.canceled) {
              mainWindow.webContents.send('save-file-as', result.filePath);
            }
          }
        },
        {
          label: 'Toggle Auto-Save',
          type: 'checkbox',
          checked: false,
          click: (menuItem) => {
            mainWindow.webContents.send('toggle-auto-save', menuItem.checked);
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = createMenu;
