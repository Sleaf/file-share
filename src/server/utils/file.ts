import path from 'path';
import { promises as fsPromise } from 'fs';
import { showAllFile } from '@/config';
import { toAutoUnit } from '@/utils/number';
import { getTimeString } from '@/server/utils/log';

type FileListItem = {
  directories: Array<FileItem>;
  files: Array<FileItem>;
};

export const isUnixHiddenFilename = (fileName: string) => /(^|\/)\.[^/.]/g.test(fileName);

/*
 * 读取文件列表
 * */
export const loadFiles = async (dirPath: string) => {
  const results = await fsPromise.readdir(dirPath, { withFileTypes: true });
  const fileDirents = showAllFile ? results : results.filter(file => !isUnixHiddenFilename(file.name));
  const fileStats = await Promise.all(
    fileDirents.map(fileInfo =>
      fsPromise.stat(path.resolve(dirPath, fileInfo.name)).then(stat => ({ stat, fileInfo })),
    ),
  );
  const fileLists = fileStats.map(
    file =>
      ({
        name: file.fileInfo.name,
        isDirectory: file.stat.isDirectory(),
        isFile: file.stat.isFile(),
        size: `${toAutoUnit(file.stat.size)}B`,
        lastModify: getTimeString(file.stat.mtime, 'yyyy/MM/dd HH:mm:ss'),
      } as FileItem),
  );
  const directories = fileLists.filter(fileStat => fileStat.isDirectory);
  const files = fileLists.filter(fileStat => fileStat.isFile);
  return {
    directories,
    files,
  } as FileListItem;
};
