import React, { useCallback, useEffect, useRef } from 'react';
import { useBoolean } from 'react-hanger';
import classnames from 'classnames';
import { Progress } from 'rsuite';
import UploadIcon from '@/client/assets/images/icon-upload.jpg';
import useDirectState from '@/client/utils/hooks/useDirectState';

const UploadWidget = () => {
  const { value: isOverModal, setTrue: enterModal, setFalse: leaveModal } = useBoolean(false);
  const { value: uploadProgress, onChange: setProgress } = useDirectState<Nullable<number>>(null); // null为未开始，超过100为错误
  const uploadFormRef = useRef<HTMLFormElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const handleUpload = useCallback(() => {
    const xhr = new XMLHttpRequest();
    if (xhr.upload) {
      const formData = new FormData(uploadFormRef.current || undefined);
      xhr.upload.onloadstart = () => setProgress(0);
      xhr.upload.onprogress = ({ total, loaded }) => total > 0 && setProgress(loaded / total);
      xhr.open('POST', `/api/upload${window.location.pathname}`, true);
      xhr.send(formData);
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status < 400) {
          window.location.reload();
        } else {
          setProgress(xhr.status);
        }
      }
    };
  }, [setProgress]);
  const handleDragDrop = useCallback(
    e => {
      e.preventDefault();
      leaveModal();
      e.dataTransfer.dropEffect = 'copy';
      if (uploadInputRef.current) {
        uploadInputRef.current.files = e.dataTransfer.files;
      }
      handleUpload();
    },
    [handleUpload, leaveModal],
  );
  useEffect(() => {
    if (!isOverModal) {
      // 没有drag
      window.addEventListener('dragover', enterModal);
      return () => window.removeEventListener('dragover', enterModal);
    }
  }, [enterModal, isOverModal]);
  return (
    <div
      id="upload-modal"
      className={classnames({
        'drag-exit': !isOverModal,
        'drag-over': isOverModal,
      })}
      onDragOver={e => e.preventDefault()}
      onDragLeave={leaveModal}
      onDrop={handleDragDrop}
    >
      <div id="upload-area">
        <span>来 ～ 搁这儿放️</span>
        {uploadProgress != null && (
          <Progress.Circle
            percent={uploadProgress}
            status={uploadProgress > 100 ? 'fail' : uploadProgress === 100 ? 'success' : undefined}
          />
        )}
      </div>
      <div id="upload-btn" onClick={() => uploadInputRef.current?.click()}>
        <img src={UploadIcon} alt="上传" title="上传文件" />
      </div>
      <form ref={uploadFormRef} id="upload-form" method="post" encType="multipart/form-data">
        <input ref={uploadInputRef} onChange={handleUpload} type="file" name="fileList" id="upload-input" multiple />
      </form>
    </div>
  );
};

export default UploadWidget;
