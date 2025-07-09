import { useLocalStorage } from '@core/ui';
import { useCallback, useEffect, useState } from 'react';
import {
  AVATAR_OPTIONS,
  getAvatarDataUri,
  PersonalAvatarName,
} from './avatar-dictionary';

const SELECTED_AVATAR_STORAGE_KEY = 'selected-avatar-data-uri';

export function useCachedPersonalAvatar() {
  const localStorage = useLocalStorage();
  const [fallbackAvatar] = AVATAR_OPTIONS;
  const [avatar, setAvatar] = useState<string>(fallbackAvatar);

  useEffect(() => {
    (async () => {
      const cachedAvatar = await localStorage.get<string>(
        SELECTED_AVATAR_STORAGE_KEY,
      );

      if (cachedAvatar) {
        setAvatar(cachedAvatar);
      }
    })();
  }, [localStorage]);

  return avatar;
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
