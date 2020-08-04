import React, { useEffect } from 'react';

import useFetchData from '@/client/utils/hooks/useFetchData';
import { FETCH_FILE_LIST, GET_SERVER_STATUS } from '@/client/constants/APIs';

import { safeGetArray } from '@/utils/array';
import { EmptyObject } from '@/constants/literal';
import FileTable from '@/client/components/FileTable';
import UploadWidget from './component/uploadWidget';

const SERVER_STATUS_REFRESH_INTERVAL = 60 * 1000;
const FileList = () => {
  const { value: fileList, fetchData: fetchList, isFetching } = useFetchData(FETCH_FILE_LIST, EmptyObject);
  const { value: serverStatus, fetchData: fetchServerStatus } = useFetchData(GET_SERVER_STATUS, EmptyObject);
  useEffect(() => {
    const handler = async () => {
      const curStatus = await fetchServerStatus();
      if (curStatus.fileListUpdateTIme > fileList.lastUpdate) {
        fetchList();
      }
    };
    handler();
    const timer = setInterval(handler, SERVER_STATUS_REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchList, fetchServerStatus, fileList.lastUpdate]);
  return (
    <div className="file-list-container">
      <div className="toobar">
        <h3>Click file name to download</h3>
      </div>
      <FileTable data={safeGetArray<FileItem>(fileList, 'fileList')} loading={isFetching} />
      {serverStatus.writeMode && <UploadWidget />}
    </div>
  );
};

export default FileList;
