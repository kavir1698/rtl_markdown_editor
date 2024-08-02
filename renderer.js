document.addEventListener('DOMContentLoaded', () => {
  const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    mode: 'markdown',
    lineNumbers: true,
    lineWrapping: true,
    direction: 'rtl',
    theme: 'default',
    rtlMoveVisually: true,
  });

  editor.setValue('# سلام دنیا\n\nاین یک ویرایشگر مارک‌داون راست به چپ است.');

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