const uploadForm = document.getElementById('upload-form');
const uploadInput = document.getElementById('upload-input');
const uploadBtn = document.getElementById('upload-btn');
const uploadModal = document.getElementById('upload-modal');
const uploadArea = document.getElementById('upload-area');
const uploadingProgress = document.getElementById('uploading-progress');

function handleDragLeave() {
  uploadModal.removeEventListener('dragleave', handleDragLeave);
  uploadModal.classList.replace('drag-over', 'drag-exit');
  window.addEventListener('dragover', handleDragEnter);
}

function handleDragDrop(e) {
  e.preventDefault();
  console.log('down');
  uploadModal.removeEventListener('drop', handleDragDrop);
  e.dataTransfer.dropEffect = 'copy';
  uploadInput.files = e.dataTransfer.files;
  handleUpload();
}

function handleDragEnter() {
  uploadModal.classList.remove('drag-exit');
  uploadModal.classList.add('drag-over');
  window.removeEventListener('dragover', handleDragEnter);
  uploadModal.addEventListener('dragleave', handleDragLeave);
  uploadModal.addEventListener('drop', handleDragDrop);
}

function handleUpload() {
  const formData = new FormData(uploadForm);
  const xhr = new XMLHttpRequest();
  if (xhr.upload) {
    xhr.upload.onloadstart = function () {
      uploadArea.firstChild.innerText = `上传中...`;
      uploadingProgress.style.visibility = 'visible';
      uploadingProgress.value = 0;
    };
    xhr.upload.onprogress = function (ev) {
      if (ev.total > 0) {
        uploadingProgress.value = ev.loaded / ev.total;
      }
    };
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status < 400) {
        window.location.reload();
      } else {
        uploadArea.firstChild.innerText = `上传失败 - ${xhr.status}`;
      }
    }
  };
  xhr.open('POST', uploadForm.action + window.location.pathname, true);
  xhr.send(formData);
}

window.addEventListener('dragover', handleDragEnter);
uploadModal.addEventListener('dragover', e => e.preventDefault());
uploadBtn.addEventListener('click', () => uploadInput.click());
uploadInput.addEventListener('change', handleUpload);