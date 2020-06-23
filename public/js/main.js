const uploadForm = document.getElementById('upload-form');
const uploadInput = document.getElementById('upload-input');
const uploadBtn = document.getElementById('upload-btn');
const uploadModal = document.getElementById('upload-modal');
const uploadArea = document.getElementById('upload-area');
const uploadingProgress = document.getElementById('uploading-progress');

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

let exitedTimer;

function handleDragEnter() {
  clearTimeout(exitedTimer);
  uploadModal.classList.remove('drag-exit');
  uploadModal.classList.add('drag-over');
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
}

function handleDragDrop(ev) {
  window.dispatchEvent(new Event('dragleave'));
  ev.preventDefault();
  ev.stopPropagation();
  uploadInput.files = ev.dataTransfer.files;
  handleUpload();
}

function handleDragLeave() {
  if (!uploadModal.classList.contains('drag-over')) {
    return;
  }

  uploadModal.classList.replace('drag-over', 'drag-exit');
  if (exitedTimer) {
    clearTimeout(exitedTimer);
  }
  exitedTimer = setTimeout(() => {
    uploadModal.classList.remove('drag-exit', 'drag-over');
  }, 500);
}

window.addEventListener('dragenter', handleDragEnter);
uploadBtn.addEventListener('click', () => uploadInput.click());
uploadInput.addEventListener('change', handleUpload);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadModal.addEventListener('dragover', handleDragOver, false);
uploadModal.addEventListener('drop', handleDragDrop);
