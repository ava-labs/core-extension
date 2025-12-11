import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useQueryParams } from '@core/ui';

import { DeFiSortOption } from '../utils/sortProtocols';

export const useDeFiQueryParams = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const params = useQueryParams();

  const setFilter = useCallback(
    (filter: string | null) => {
      if (filter) {
        params.set('filter', filter);
      } else {
        params.delete('filter');
      }
      history.push({
        pathname,
        search: params.toString(),
      });
    },
    [params, history, pathname],
  );

  const setSort = useCallback(
    (sort: DeFiSortOption | null) => {
      if (sort) {
        params.set('sort', sort);
      } else {
        params.delete('sort');
      }
      history.push({
        pathname,
        search: params.toString(),
      });
    },
    [params, history, pathname],
  );

  return {
    filter: params.get('filter'),
    sort: params.get('sort') as DeFiSortOption | null,
    setFilter,
    setSort,
  };
};
