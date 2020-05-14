const uploadForm = document.getElementById('upload-form');
const uploadInput = document.getElementById('upload-input');
document.getElementsByClassName('upload-btn')[0].addEventListener('click', () => {
  uploadInput.click()
});

uploadInput.addEventListener('change', (e) => {
  upload()
});

function upload() {
  const formData = new FormData(uploadForm)
  const xhr = new XMLHttpRequest();
  xhr.open('POST', uploadForm.action, true);
  xhr.onload = function (e) {
    window.location.reload()
  }
  xhr.send(formData);
}

const uploadModal = document.getElementsByClassName('upload-modal')[0]
const uploadArea = document.getElementsByClassName('upload-area')[0]
let exitedTimer
window.addEventListener('dragenter', e => {
  clearTimeout(exitedTimer)
  uploadModal.classList.remove('drag-exit')
  uploadModal.classList.add('drag-over')
})

uploadArea.addEventListener('dragleave', ev => {
  if (!uploadModal.classList.contains('drag-over')) {
    return;
  }

  uploadModal.classList.replace('drag-over', 'drag-exit')
  if (exitedTimer) {
    clearTimeout(exitedTimer)
  }
  exitedTimer = setTimeout(() => {
    uploadModal.classList.remove('drag-exit', 'drag-over')
  }, 1000)
})

uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
}, false)

uploadArea.addEventListener('drop', ev => {
  window.dispatchEvent(new Event('dragleave'))
  ev.preventDefault();
  ev.stopPropagation();
  const files = []

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);
        files.push(file);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      var file = ev.dataTransfer.files[i]
      files.push(file)
    }
  }
  uploadInput.files = ev.dataTransfer.files
  upload()
})