import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { FavoritesState } from './models';

const FAVORITES_STORAGE_KEY = 'favorites';

export const saveFavoritesToStorage = (favs: FavoritesState) =>
  saveToStorage({ [FAVORITES_STORAGE_KEY]: favs });

export const getFavoritesFromStorage = () =>
  getFromStorage<{ favorites: FavoritesState }>(FAVORITES_STORAGE_KEY).then(
    (storage) => storage[FAVORITES_STORAGE_KEY]
  );

export function removeAllFavoritesFromStorage() {
  return removeFromStorage(FAVORITES_STORAGE_KEY);
}
