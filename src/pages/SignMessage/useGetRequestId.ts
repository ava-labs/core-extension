import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

export function useGetJsonRequestId() {
  const history = useHistory();

  return useMemo(() => {
    return (
      history.location.search && history.location.search.replace('?id=', '')
    );
  }, [history.location.search]);
}
