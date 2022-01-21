import { createContext, useContext, useEffect, useState } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { LoadingIcon } from '@avalabs/react-components';
import { ExtensionRequest } from '@src/background/connections/models';
import { FavoritesState } from '@src/background/services/favorites/models';
import { TokenWithBalance } from '@avalabs/wallet-react-components';

const FavoritesContext = createContext<{
  favorites?: FavoritesState;
  createFavorite(token: TokenWithBalance): Promise<any>;
  removeFavorite(token: TokenWithBalance): Promise<any>;
  getFavorites(token: TokenWithBalance): Promise<FavoritesState>;
}>({} as any);

export function FavoritesContextProvider({ children }: { children: any }) {
  const [favorites, setFavorites] = useState<FavoritesState>();
  const { request, events } = useConnectionContext();

  function getFavorites() {
    return request({
      method: ExtensionRequest.FAVORITES_GET,
    }).then((result) => {
      setFavorites(result);
      return result;
    });
  }

  useEffect(() => {
    if (!request || !events) {
      return;
    }

    getFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  if (!request || !events) {
    return <LoadingIcon />;
  }

  async function createFavorite(token: TokenWithBalance) {
    await request({
      method: ExtensionRequest.FAVORITES_CREATE,
      params: [token],
    });
    return getFavorites();
  }

  async function removeFavorite(token: TokenWithBalance) {
    await request({
      method: ExtensionRequest.FAVORITES_REMOVE,
      params: [token],
    });
    return getFavorites();
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        createFavorite,
        getFavorites,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  return useContext(FavoritesContext);
}
