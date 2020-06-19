const uploadForm = document.getElementById('upload-form');
const uploadInput = document.getElementById('upload-input');
const uploadBtn = document.getElementsByClassName('upload-btn')[0];
const uploadModal = document.getElementsByClassName('upload-modal')[0];
const uploadArea = document.getElementsByClassName('upload-area')[0];

uploadBtn.addEventListener('click', uploadInput.click);
uploadInput.addEventListener('change', upload);

function upload() {
  const formData = new FormData(uploadForm);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', uploadForm.action + window.location.pathname, true);
  xhr.onload = function () {
    window.location.reload();
  };
  xhr.send(formData);
}

let exitedTimer;
window.addEventListener('dragenter', e => {
  clearTimeout(exitedTimer);
  uploadModal.classList.remove('drag-exit');
  uploadModal.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', ev => {
  if (!uploadModal.classList.contains('drag-over')) {
    return;
  }

  uploadModal.classList.replace('drag-over', 'drag-exit');
  if (exitedTimer) {
    clearTimeout(exitedTimer);
  }
  exitedTimer = setTimeout(() => {
    uploadModal.classList.remove('drag-exit', 'drag-over');
  }, 1000);
});

uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
}, false);

uploadArea.addEventListener('drop', ev => {
  window.dispatchEvent(new Event('dragleave'));
  ev.preventDefault();
  ev.stopPropagation();
  uploadInput.files = ev.dataTransfer.files;
  upload();
});