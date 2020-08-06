export type FileItem = {
  name: string;
  isDirectory: boolean;
  isFile: boolean;
  size: number;
  lastModify: number;
};

export type ServerStatus = {
  fileListUpdateTIme: Nullable<Timestamp>;
  version: string;
  showAllFile: boolean;
  shareDir: boolean;
  writeMode: boolean;
  forceMode: boolean;
};

export type FileListData = {
  lastUpdate: Nullable<Timestamp>;
  fileList: Array<FileItem>;
};
