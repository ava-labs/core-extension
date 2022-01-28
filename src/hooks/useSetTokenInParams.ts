import { useHistory, useLocation } from 'react-router-dom';

export function useSetTokenInParams() {
  const { pathname } = useLocation();
  const history = useHistory();

  return (symbol: string, path = pathname) =>
    history.push({
      pathname: path,
      search: `?${new URLSearchParams({ token: symbol }).toString()}`,
    });
}
