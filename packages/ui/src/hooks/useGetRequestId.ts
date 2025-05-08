import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This is used to get the id of a transaction or message that
 * has been put into localstorage and to be used across multiple
 * contexts. We grab the query param and use that to get the item out of storage.
 *
 * @returns id from the query param
 */
export function useGetRequestId() {
  const location = useLocation();

  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search ?? '');
    return searchParams.get('actionId') ?? '';
  }, [location.search]);
}
