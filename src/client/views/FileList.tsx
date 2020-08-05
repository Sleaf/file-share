import React, { useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useFetchData from '@/client/utils/hooks/useFetchData';
import { FETCH_FILE_LIST, GET_SERVER_STATUS } from '@/client/constants/APIs';
import { safeGetArray } from '@/utils/array';
import { EmptyObject } from '@/constants/literal';
import { FileItem } from '@/@types/transition';
import FileTable from './components/FileTable';
import UploadWidget from './components/uploadWidget';

const SERVER_STATUS_REFRESH_INTERVAL = 5000;
const fetchConfig = {
  cache: true,
};
const FileList = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { value: fileList, fetchData: fetchList, isFetching } = useFetchData(FETCH_FILE_LIST, EmptyObject, fetchConfig);
  const { value: serverStatus, fetchData: fetchServerStatus } = useFetchData(
    GET_SERVER_STATUS,
    EmptyObject,
    fetchConfig,
  );
  useEffect(() => void fetchServerStatus(pathname), [fetchServerStatus, pathname]);
  useEffect(() => void fetchList(pathname), [fetchList, pathname]);
  useEffect(() => {
    const heartbeatHandler = async () => {
      const curStatus = await fetchServerStatus(pathname);
      if (curStatus?.fileListUpdateTIme && fileList.lastUpdate && curStatus.fileListUpdateTIme > fileList.lastUpdate) {
        fetchList(pathname);
      }
    };
    const timer = setInterval(heartbeatHandler, SERVER_STATUS_REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchList, fetchServerStatus, fileList.lastUpdate, pathname]);
  const handleClickRow = useCallback(
    (rowData: FileItem) => {
      if (rowData.isDirectory) {
        history.push(rowData.name);
      }
    },
    [history],
  );
  const handleUploaded = useCallback(() => fetchList(pathname), [fetchList, pathname]);
  return (
    <div className="file-list-container">
      <FileTable data={safeGetArray<FileItem>(fileList, 'fileList')} loading={isFetching} onRowClick={handleClickRow} />
      {serverStatus.writeMode && <UploadWidget onUploaded={handleUploaded} />}
    </div>
  );
};

export default FileList;
