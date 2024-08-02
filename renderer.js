// renderer.js
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    mode: 'markdown',
    lineNumbers: true,
    lineWrapping: true,
    direction: 'rtl',
    theme: 'default',
    rtlMoveVisually: true,
    viewportMargin: Infinity,
  });

  let isAutoSaveEnabled = false;
  let autoSaveTimer = null;

  // Handle Ctrl+S shortcut
  async function saveFile() {
    if (currentFilePath) {
      const result = await ipcRenderer.invoke('save-file', { filePath: currentFilePath, content: editor.getValue() });
      if (!result.success) {
        console.error('Failed to save file:', result.error);
      }
    } else {
      const result = await ipcRenderer.invoke('save-file-dialog');
      if (!result.canceled) {
        currentFilePath = result.filePath;
        const saveResult = await ipcRenderer.invoke('save-file', { filePath: currentFilePath, content: editor.getValue() });
        if (!saveResult.success) {
          console.error('Failed to save file:', saveResult.error);
        }
      }
    }
  }

  // Handle Ctrl+S shortcut
  document.addEventListener('keydown', async (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      await saveFile();
    }
  });

  // Auto-save functionality
  function startAutoSave() {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(async () => {
      if (currentFilePath && isAutoSaveEnabled) {
        await saveFile();
        console.log('Auto-saved');
      }
    }, 3000); // Auto-save after 3 seconds of inactivity
  }

  editor.on('change', () => {
    if (isAutoSaveEnabled) {
      startAutoSave();
    }
  });

  ipcRenderer.on('save-file', saveFile);

  ipcRenderer.on('toggle-auto-save', (event, enabled) => {
    isAutoSaveEnabled = enabled;
    console.log('Auto-save toggled:', enabled);
    if (!enabled && autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
  });

  // Ensure the editor takes up the full height
  const resizeEditor = () => {
    editor.setSize(null, window.innerHeight);
  };

  // Initial resize
  resizeEditor();

  // Resize on window resize
  window.addEventListener('resize', resizeEditor);

  editor.setValue('# سلام دنیا\n\nاین یک ویرایشگر مارک‌داون راست به چپ است.');

  let currentFilePath = null;

  ipcRenderer.on('new-file', () => {
    editor.setValue('');
    currentFilePath = null;
  });

  ipcRenderer.on('file-opened', (event, content) => {
    editor.setValue(content);
  });

  ipcRenderer.on('save-file', () => {
    if (currentFilePath) {
      ipcRenderer.send('save-file', { filePath: currentFilePath, content: editor.getValue() });
    } else {
      ipcRenderer.send('save-file-as', editor.getValue());
    }
  });

  ipcRenderer.on('save-file-as', (event, filePath) => {
    currentFilePath = filePath;
    ipcRenderer.send('save-file', { filePath, content: editor.getValue() });
  });

  editor.on('change', () => {
    console.log('Editor content changed');
  });

  editor.on('focus', () => {
    console.log('Editor focused');
  });

  editor.on('blur', () => {
    console.log('Editor blurred');
  });
});
