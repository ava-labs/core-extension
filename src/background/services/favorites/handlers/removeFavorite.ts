import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { firstValueFrom } from 'rxjs';
import { favorites$ } from '../favorites';
import { saveFavoritesToStorage } from '../storage';
import { getTokenKey } from '../utils/getTokenKey';

export async function removeFavorite(request: ExtensionConnectionMessage) {
  const [token] = request.params || [];

  const favs = await firstValueFrom(favorites$);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [getTokenKey(token)]: _removed, ...remainingFavs } = favs;

  const [, err] = await resolve(saveFavoritesToStorage(remainingFavs));

  if (err) {
    return {
      ...request,
      error: err,
    };
  }

  return {
    ...request,
    result: true,
  };
}

export const RemoveFavoriteRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.FAVORITES_REMOVE, removeFavorite];
