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
