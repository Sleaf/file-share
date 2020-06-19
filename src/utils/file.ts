import { readdir, statSync } from 'fs';
import { showAllFile } from '../config';
import path from 'path';
import { toAutoUnit } from '../utils/number';
import { getTimeString } from '../utils/log';

type FileItem = {
  name: string;
  isDirectory: boolean;
  isFile: boolean;
  size: string;
  lastModify: string;
}
type fileList = {
  directories: Array<FileItem>;
  files: Array<FileItem>;
}

/*
* 读取文件列表
* */
export const loadFiles = (dirPath: string) => new Promise<fileList>((resolve, reject) =>
  readdir(dirPath, { withFileTypes: true }, (err, results) => {
    if (err) return reject(err);
    const fileDirents = showAllFile ? results : results.filter(file => !(/(^|\/)\.[^\/.]/g).test(file.name));
    const fileStats = fileDirents.map(file => {
      const fileState = statSync(path.resolve(dirPath, file.name));
      return ({
        name: file.name,
        isDirectory: file.isDirectory(),
        isFile: file.isFile(),
        size: `${toAutoUnit(fileState.size)}B`,
        lastModify: getTimeString(fileState.mtime, 'yyyy/MM/dd HH:mm:ss'),
      });
    });
    const directories = fileStats.filter(fileStat => fileStat.isDirectory);
    const files = fileStats.filter(fileStat => fileStat.isFile);
    return resolve({
      directories,
      files,
    });
  }),
);
