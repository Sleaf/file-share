import { useCallback, useState } from 'react';
import { SortOrder } from '@/constants/enums';

const useSortControl = (defaultSortColumn?: string, defaultSortType = SortOrder.DESC) => {
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortType, setSortType] = useState(defaultSortType);
  const handleSort = useCallback((nextSortColumn, nextSortType) => {
    setSortColumn(nextSortColumn);
    setSortType(nextSortType);
  }, []);
  const setDefaultSort = useCallback(() => {
    setSortColumn(defaultSortColumn);
    setSortType(defaultSortType);
  }, [defaultSortColumn, defaultSortType]);
  return {
    sortColumn,
    sortType,
    handleSort,
    setDefaultSort,
  };
};
export default useSortControl;
