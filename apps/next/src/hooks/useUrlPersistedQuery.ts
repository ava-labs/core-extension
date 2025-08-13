import { debounce } from 'lodash';
import { useMemo, useRef } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

export function useUrlPersistedQuery<K extends string>(
  key: K,
  pathname?: string,
) {
  const { path } = useRouteMatch();
  const {
    replace,
    location: { search },
  } = useHistory();

  const finalPathname = pathname ?? path;

  const searchParams = new URLSearchParams(search);
  const query = searchParams.get(key) ?? '';

  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const updateQuery = useMemo(
    () =>
      debounce((value: string) => {
        const { current } = searchParamsRef;
        const updated = new URLSearchParams(current);
        updated.set(key, value);

        replace({
          pathname: finalPathname,
          search: updated.toString(),
        });
      }, 50),
    [key, finalPathname, replace],
  );

  return [query, updateQuery] as const;
}
