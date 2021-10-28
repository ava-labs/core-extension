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

export async function createFavorite(request: ExtensionConnectionMessage) {
  const [token] = request.params || [];

  const favs = await firstValueFrom(favorites$);

  const [, err] = await resolve(
    saveFavoritesToStorage({ ...favs, [getTokenKey(token)]: token })
  );

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

export const CreateFavoriteRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.FAVORITES_CREATE, createFavorite];
