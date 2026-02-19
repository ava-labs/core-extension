import { getRandomAvatar } from '@/components/Avatar';
import {
  AVATAR_OPTIONS,
  PersonalAvatarName,
} from '@/components/PersonalAvatar';

export function getAvatarName(
  avatar: string | PersonalAvatarName | undefined,
): PersonalAvatarName | undefined {
  if (!avatar) {
    return undefined;
  }

  if (avatar in AVATAR_OPTIONS) {
    return avatar as PersonalAvatarName;
  }

  const [name] = Object.entries(AVATAR_OPTIONS).find(
    ([, value]) => value === avatar,
  ) ?? [getRandomAvatar()];
  return name as PersonalAvatarName;
}
