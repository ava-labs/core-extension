import { BehaviorSubject, filter, switchMap } from 'rxjs';
import { storageKey$ } from '../wallet/storageKey';
import { FavoritesState } from './models';
import { getFavoritesFromStorage } from './storage';

export const favorites$ = new BehaviorSubject<FavoritesState>({});

storageKey$
  .pipe(
    filter((ready) => !!ready),
    switchMap(() => getFavoritesFromStorage())
  )
  .subscribe((favoritesState) => {
    !!favoritesState && favorites$.next(favoritesState);
  });
