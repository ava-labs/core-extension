import { useHistory } from 'react-router-dom';

export function useGoBack(routeToGoBack = '/home') {
  const history = useHistory();

  return () => {
    if (history.length <= 2) {
      history.replace(routeToGoBack);
      return;
    }

    history.goBack();
  };
}
