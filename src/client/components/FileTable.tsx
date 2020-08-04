import React from 'react';

import { Table } from 'rsuite';
import useSortControl from '@/client/utils/hooks/useSortControl';

const { Cell, Column, HeaderCell } = Table;
type FileTableProp = {
  data: Array<FileItem>;
  loading?: boolean;
};

const FileTable = ({ data, loading }: FileTableProp) => {
  const { sortColumn, sortType, handleSort } = useSortControl();
  return (
    <Table
      height={500}
      data={data}
      loading={loading}
      sortColumn={sortColumn}
      sortType={sortType}
      onSortColumn={handleSort}
    >
      <Column flexGrow={1} sortable>
        <HeaderCell>Name</HeaderCell>
        <Cell dataKey="name" />
      </Column>
      <Column width={120} sortable>
        <HeaderCell>Size</HeaderCell>
        <Cell dataKey="size" />
      </Column>
      <Column width={150} sortable>
        <HeaderCell>Date Modified</HeaderCell>
        <Cell dataKey="lastModify" />
      </Column>
    </Table>
  );
};

export default FileTable;
