// renderer.js
const { ipcRenderer } = require('electron');

let currentFilePath = null;

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

  let isAutoSaveEnabled = true;
  let autoSaveTimer = null;

  async function saveFile() {
    if (currentFilePath) {
      const result = await ipcRenderer.invoke('save-file', { filePath: currentFilePath, content: editor.getValue() });
      if (!result.success) {
        console.error('Failed to save file:', result.error);
      }
    } else {
      await saveAs();
    }
  }

  async function saveAs() {
    const result = await ipcRenderer.invoke('save-file-dialog');
    if (!result.canceled) {
      currentFilePath = result.filePath;
      const saveResult = await ipcRenderer.invoke('save-file', { filePath: currentFilePath, content: editor.getValue() });
      if (!saveResult.success) {
        console.error('Failed to save file:', saveResult.error);
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
    console.log('Editor content changed');
  });

  ipcRenderer.on('menu-save', saveFile);
  ipcRenderer.on('menu-save-as', saveAs);

  ipcRenderer.on('menu-open', async () => {
    const result = await ipcRenderer.invoke('open-file-dialog');
    if (result) {
      currentFilePath = result.filePath;
      editor.setValue(result.content);
    }
  });

  ipcRenderer.on('toggle-auto-save', (event, enabled) => {
    isAutoSaveEnabled = enabled;
    console.log('Auto-save toggled:', enabled);
    if (!enabled && autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
  });

  // Add undo and redo handlers
  ipcRenderer.on('undo', () => {
    editor.undo();
  });

  ipcRenderer.on('redo', () => {
    editor.redo();
  });

  // Add copy and paste handlers (optional, as CodeMirror handles these by default)
  ipcRenderer.on('copy', () => {
    const selectedText = editor.getSelection();
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
    }
  });

  ipcRenderer.on('paste', async () => {
    try {
      const text = await navigator.clipboard.readText();
      editor.replaceSelection(text);
    } catch (err) {
      console.error('Failed to paste:', err);
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

  ipcRenderer.on('new-file', () => {
    editor.setValue('');
    currentFilePath = null;
  });

  editor.on('focus', () => {
    console.log('Editor focused');
  });

  editor.on('blur', () => {
    console.log('Editor blurred');
  });
});
