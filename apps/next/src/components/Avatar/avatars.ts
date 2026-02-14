import { random } from 'lodash';
import { AVATAR_OPTIONS, PersonalAvatarName } from '../PersonalAvatar';

export const AVATAR_ROWS = [
  AVATAR_OPTIONS.filter((_, index) => index % 2 === 0),
  AVATAR_OPTIONS.filter((_, index) => index % 2 !== 0),
];

export function getRandomAvatar(): PersonalAvatarName {
  const count = AVATAR_OPTIONS.length;
  const randomIndex = random(0, count - 1, false);
  const randomAvatar = AVATAR_OPTIONS[randomIndex];
  return randomAvatar ?? AVATAR_OPTIONS[0];
}
