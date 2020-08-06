import React, { useCallback, useEffect, useRef } from 'react';
import { useBoolean } from 'react-hanger';
import { Modal, Progress, Alert } from 'rsuite';
import classnames from 'classnames';
import UploadIcon from '@/client/assets/images/icon-upload.jpg';
import useDirectState from '@/client/utils/hooks/useDirectState';
import { appendParams } from '@/utils/string';
import { useLocation } from 'react-router-dom';
import { toPercent2 } from '@/utils/number';

type UploadWidgetProp = {
  onUploaded?: () => void;
};
const UploadWidget = ({ onUploaded }: UploadWidgetProp) => {
  const { pathname } = useLocation();
  const { value: isOverModal, setTrue: enterModal, setFalse: leaveModal } = useBoolean(false);
  const { value: uploadProgress, onChange: setProgress } = useDirectState<Nullable<number>>(null); // null为未开始，超过100为错误
  const uploadFormRef = useRef<HTMLFormElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const handleUpload = useCallback(() => {
    const xhr = new XMLHttpRequest();
    if (xhr.upload) {
      const formData = new FormData(uploadFormRef.current || undefined);
      xhr.upload.onloadstart = () => setProgress(0);
      xhr.upload.onprogress = ({ total, loaded }) => total > 0 && setProgress((loaded / total) * 100);
      xhr.open('POST', appendParams('/api/upload', { path: pathname }), true);
      xhr.send(formData);
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status < 400) {
          onUploaded?.();
        } else {
          setProgress(xhr.status);
          Alert.error(`文件上传失败: ${xhr.status}`, 5000);
        }
      }
    };
  }, [onUploaded, pathname, setProgress]);
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
      <Modal backdrop="static" show={uploadProgress != null && uploadProgress < 100}>
        <Modal.Body>
          {uploadProgress != null && (
            <Progress.Circle
              percent={uploadProgress}
              status={uploadProgress > 100 ? 'fail' : uploadProgress === 100 ? 'success' : undefined}
            >
              {toPercent2(uploadProgress / 100)}
            </Progress.Circle>
          )}
        </Modal.Body>
      </Modal>
      <div id="upload-area">来 ～ 搁这儿放️</div>
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
