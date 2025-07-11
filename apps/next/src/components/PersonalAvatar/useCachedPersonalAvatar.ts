import { useLocalStorage } from '@core/ui';
import { use, useCallback, useRef } from 'react';
import {
  AVATAR_OPTIONS,
  getAvatarDataUri,
  PersonalAvatarName,
} from './avatar-dictionary';

const SELECTED_AVATAR_STORAGE_KEY = 'selected-avatar-data-uri';

export function useCachedPersonalAvatar(skip: boolean) {
  const localStorage = useLocalStorage();
  const loaderRef = useRef<Promise<string | undefined>>(undefined);

  if (skip) {
    return AVATAR_OPTIONS[0];
  }

  if (!loaderRef.current) {
    loaderRef.current = localStorage.get<string>(SELECTED_AVATAR_STORAGE_KEY);
  }

  const cachedAvatar = use(loaderRef.current);
  return cachedAvatar ?? AVATAR_OPTIONS[0];
}

export function usePersonalAvatarSaver() {
  const localStorage = useLocalStorage();

  const cachePersonalAvatar = useCallback(
    async (avatar: PersonalAvatarName) => {
      const dataUri = await getAvatarDataUri(avatar);
      await localStorage.set(SELECTED_AVATAR_STORAGE_KEY, dataUri);
      return dataUri;
    },
    [localStorage],
  );

  return cachePersonalAvatar;
}
