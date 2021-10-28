import { BehaviorSubject } from 'rxjs';
import { FavoritesState } from './models';
import { getFavoritesFromStorage } from './storage';

export const favorites$ = new BehaviorSubject<FavoritesState>({});

getFavoritesFromStorage().then((favoritesState) => {
  !!favoritesState && favorites$.next(favoritesState);
});
