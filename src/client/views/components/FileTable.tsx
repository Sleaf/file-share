import React, { useCallback, useEffect, useMemo } from 'react';
import { Breadcrumb, Icon, Input, InputGroup, Table } from 'rsuite';
import { Link, useHistory, useLocation } from 'react-router-dom';
import useSortControl from '@/client/utils/hooks/useSortControl';
import { FileItem } from '@/@types/transition';
import { toCompareSorter } from '@/utils/array';
import { toDateString } from '@/utils/date';
import { toAutoUnit, toRound, toSignificantDigits } from '@/utils/number';
import { appendParams, toSafeFilePath } from '@/utils/string';
import { SortOrder } from '@/constants/enums';
import useDirectState from '@/client/utils/hooks/useDirectState';

const { Cell, Column, HeaderCell } = Table;

const getTableHeight = (offset = 0) => window.innerHeight - offset;

type FileTableProp = {
  data: Array<FileItem>;
  heightOffset?: number;
  loading?: boolean;
};

const FileTable = ({ data, loading, heightOffset }: FileTableProp) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { value: tableHeight, onChange: setTableHeight } = useDirectState(getTableHeight(heightOffset));
  const { value: fileterText, onChange: setFileterText } = useDirectState('');
  const { sortColumn, sortType, handleSort } = useSortControl('name', SortOrder.ASC);
  const renderFileList = useMemo(() => {
    let rawData = data;
    try {
      const regGroup = fileterText.match(/^\/(.+)\/(\w+)?$/);
      const matcher = regGroup ? new RegExp(regGroup[1], regGroup[2] || 'ig') : new RegExp(fileterText, 'ig');
      rawData = fileterText ? data.filter(i => i.name.match(matcher)) : data;
    } catch (e) {
      console.warn(e);
    }
    const sortHandler = toCompareSorter(sortColumn, sortType);
    const dirList = rawData.filter(i => i.type === 'dir').sort(sortHandler);
    const fileList = rawData.filter(i => i.type === 'file').sort(sortHandler);
    return dirList.concat(fileList);
  }, [data, fileterText, sortColumn, sortType]);
  const safePath = toSafeFilePath(pathname);
  const pathSegment = useMemo(() => safePath.split('/').filter(i => i), [safePath]);
  const handleGoUpper = useCallback(
    () => pathSegment.length > 0 && history.push(`/${pathSegment.slice(0, -1).join('/')}`),
    [history, pathSegment],
  );
  const handleClickRow = useCallback(
    rowData => rowData.isDirectory && history.push(`${pathname.replace(/\/$/, '')}/${rowData.name}`),
    [history, pathname],
  );
  useEffect(() => setFileterText(''), [pathname]);
  useEffect(() => {
    const handler = () => setTableHeight(getTableHeight(heightOffset));
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [heightOffset, setTableHeight]);
  return (
    <div className="file-table-container">
      <div className="table-toolbar">
        <Breadcrumb>
          <Breadcrumb.Item componentClass={Link} to="/" active={pathname === '/'}>
            根目录
          </Breadcrumb.Item>
          {pathSegment.map((path, index) => {
            const toPath = `/${pathSegment.slice(0, index + 1).join('/')}`;
            return (
              <Breadcrumb.Item key={path} componentClass={Link} to={toPath} active={index === pathSegment.length - 1}>
                {path}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
        <InputGroup>
          <Input
            placeholder="请输入搜索内容（支持正则表达式 eg. /file/ ）"
            value={fileterText}
            onChange={setFileterText}
          />
          <InputGroup.Addon>
            <Icon icon="search" />
          </InputGroup.Addon>
        </InputGroup>
      </div>
      <Table
        className="file-table"
        height={tableHeight}
        data={renderFileList}
        loading={loading}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSort}
        onRowClick={handleClickRow}
        virtualized
        bordered
        hover
      >
        <Column width={40}>
          <HeaderCell>
            {safePath.length > 1 && <Icon className="upper-icon" icon="up" onClick={handleGoUpper} />}
          </HeaderCell>
          <Cell>{(rowData: FileItem) => <Icon icon={rowData.type === 'dir' ? 'folder-open' : 'file'} />}</Cell>
        </Column>
        <Column flexGrow={1} sortable>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name">
            {(rowData: FileItem) =>
              rowData.isDirectory ? (
                rowData.name
              ) : (
                <a
                  className="download-cell"
                  href={appendParams('/api/download', { path: `${pathname}/${rowData.name}` })}
                  download={rowData.name}
                >
                  {rowData.name}
                </a>
              )
            }
          </Cell>
        </Column>
        <Column width={120} sortable>
          <HeaderCell>Size</HeaderCell>
          <Cell dataKey="size">
            {(rowData: FileItem) => (
              <span title={`${toRound(rowData.size)} Byte`}>{toAutoUnit(rowData.size, toSignificantDigits)}B</span>
            )}
          </Cell>
        </Column>
        <Column width={180} sortable>
          <HeaderCell>Date Modified</HeaderCell>
          <Cell dataKey="lastModify">
            {(rowData: FileItem) => toDateString(new Date(rowData.lastModify), 'yyyy-MM-dd hh:mm:ss')}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default FileTable;
