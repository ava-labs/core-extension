import { PersonalAvatarName } from '@/components/PersonalAvatar';
import { Account } from '@core/types';

// Avatars from avatar-dictionary.ts
const ACCOUNT_AVATAR_OPTIONS: PersonalAvatarName[] = [
  'abstract-1.svg',
  'abstract-2.svg',
  'abstract-3.svg',
  'abstract-4.svg',
  'abstract-5.svg',
  'art-1.svg',
  'art-10.svg',
  'art-2.svg',
  'art-3.svg',
  'art-4.svg',
  'art-5.svg',
  'art-6.svg',
  'art-7.svg',
  'art-8.svg',
  'art-9.svg',
];

export const getAccountAvatars = (
  userAvatarName: PersonalAvatarName,
  accountsInWallet: Account[],
) => {
  const availableAvatars = ACCOUNT_AVATAR_OPTIONS.filter(
    (avatar) => avatar !== userAvatarName,
  );

  // If user's avatar removed all options, use original list
  const avatarsToUse =
    availableAvatars.length > 0 ? availableAvatars : ACCOUNT_AVATAR_OPTIONS;

  const avatarMap = new Map<string, PersonalAvatarName>();
  accountsInWallet.forEach((account, index) => {
    const avatarIndex = index % avatarsToUse.length;
    const selectedAvatar = avatarsToUse[avatarIndex];
    if (selectedAvatar) {
      avatarMap.set(account.id, selectedAvatar);
    }
  });

  return avatarMap;
};
