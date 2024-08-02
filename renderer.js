let editor;

document.addEventListener('DOMContentLoaded', () => {
  const editorElement = document.getElementById('editor');

  editor = CodeMirror.fromTextArea(editorElement, {
    mode: 'markdown',
    lineNumbers: true,
    lineWrapping: true,
    direction: 'rtl',
    theme: 'default',
    rtlMoveVisually: true,
  });

  // Set initial content
  editor.setValue('# سلام دنیا\n\nاین یک ویرایشگر مارک‌داون راست به چپ است.');

  // Ensure the editor takes up the full height of the window
  const updateEditorSize = () => {
    editor.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', updateEditorSize);
  updateEditorSize();

  // Handle file open
  window.electronAPI.onFileOpened((event, content) => {
    editor.setValue(content);
  });

  // Handle save request
  window.electronAPI.onSaveFileRequest(() => {
    const content = editor.getValue();
    window.electronAPI.saveFile(content);
  });
});