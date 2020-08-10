import React, { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useFetchData from '@/client/utils/hooks/useFetchData';
import { FETCH_FILE_LIST, GET_SERVER_STATUS } from '@/client/constants/APIs';
import { safeGetArray } from '@/utils/array';
import { EmptyObject } from '@/constants/literal';
import { FileItem } from '@/@types/transition';
import FileTable from './components/FileTable';
import UploadWidget from './components/UploadWidget';
import useHeartbeat from '../utils/hooks/useHeartbeat';

const SERVER_STATUS_REFRESH_INTERVAL = 5000;
const fetchConfig = {
  cache: true,
};
const FileList = () => {
  const { pathname } = useLocation();
  const { value: fileList, fetchData: fetchList, isFetching } = useFetchData(FETCH_FILE_LIST, EmptyObject, fetchConfig);
  const { value: serverStatus, fetchData: fetchServerStatus } = useFetchData(
    GET_SERVER_STATUS,
    EmptyObject,
    fetchConfig,
  );
  const statusCallback = useCallback(
    curStatus => {
      if (curStatus.fileListUpdateTIme && fileList.lastUpdate && curStatus.fileListUpdateTIme > fileList.lastUpdate) {
        fetchList(pathname);
      }
    },
    [fetchList, fileList.lastUpdate, pathname],
  );
  const statusParams = useMemo(() => [pathname], [pathname]);
  useHeartbeat(fetchServerStatus, SERVER_STATUS_REFRESH_INTERVAL, statusCallback, statusParams);
  useEffect(() => void fetchList(pathname), [fetchList, pathname]);
  const handleUploaded = useCallback(() => fetchList(pathname), [fetchList, pathname]);
  return (
    <div className="file-list-container">
      <FileTable heightOffset={110} data={safeGetArray<FileItem>(fileList, 'fileList')} loading={isFetching} />
      {serverStatus.writeMode && <UploadWidget onUploaded={handleUploaded} />}
    </div>
  );
};

export default FileList;
