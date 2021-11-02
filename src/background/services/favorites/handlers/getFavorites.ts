import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { favorites$ } from '../favorites';

export async function getFavorites(request: ExtensionConnectionMessage) {
  const favs = await firstValueFrom(favorites$);

  return {
    ...request,
    result: favs ?? {},
  };
}

export const GetFavoritesRequest: [ExtensionRequest, ConnectionRequestHandler] =
  [ExtensionRequest.FAVORITES_GET, getFavorites];
