import { useLocalStorage } from '@core/ui';
import {
  createContext,
  FC,
  PropsWithChildren,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AVATAR_OPTIONS,
  getAvatarDataUri,
  PersonalAvatarName,
} from './avatar-dictionary';

type PersonalAvatarContextValue = {
  avatar: string;
  saveAvatar: (avatar: PersonalAvatarName) => Promise<string>;
};

const PersonalAvatarContext = createContext<
  PersonalAvatarContextValue | undefined
>(undefined);
const SELECTED_AVATAR_STORAGE_KEY = 'selected-avatar-data-uri';

const DEFAULT_AVATAR = AVATAR_OPTIONS[0];

export const PersonalAvatarProvider: FC<PropsWithChildren> = ({ children }) => {
  const localStorage = useLocalStorage();
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);

  const saveAvatar = useCallback(
    async (avatarName: PersonalAvatarName) => {
      const dataUri = await getAvatarDataUri(avatarName);
      await localStorage.set(SELECTED_AVATAR_STORAGE_KEY, dataUri);
      setAvatar(dataUri);
      return dataUri;
    },
    [localStorage],
  );

  useEffect(() => {
    localStorage
      .get<string>(SELECTED_AVATAR_STORAGE_KEY)
      .then((cached) => setAvatar(cached ?? DEFAULT_AVATAR));
  }, [localStorage]);

  const value = useMemo<PersonalAvatarContextValue>(
    () => ({
      avatar,
      saveAvatar,
    }),
    [avatar, saveAvatar],
  );

  return (
    <PersonalAvatarContext.Provider value={value}>
      {children}
    </PersonalAvatarContext.Provider>
  );
};

export const usePersonalAvatar = () => {
  const avatar = use(PersonalAvatarContext);

  if (!avatar) {
    throw new Error(
      'usePersonalAvatar must be used within a PersonalAvatarProvider',
    );
  }

  return avatar;
};
