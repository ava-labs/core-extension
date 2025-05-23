// Can we somehow generate it on build time based on the directory contents?
export const AVATAR_OPTIONS = [
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
  'coin-01.svg',
  'coin-02.svg',
  'coin-03.svg',
  'coin-04.svg',
  'coin-05.svg',
  'coin-06.svg',
  'coin-07.svg',
  'cub-01.svg',
  'cub-02.svg',
  'cub-03.svg',
  'cub-04.svg',
  'cub-05.svg',
  'cub-06.svg',
  'cub-07.svg',
  'cub-08.svg',
  'cub-09.svg',
  'cub-10.svg',
  'cub-11.svg',
  'cub-13.svg',
  'cub-14.svg',
  'cub-15.svg',
  'cub-16.svg',
  'cub-17.svg',
  'cub-18.svg',
  'cub-19.svg',
  'cub-21.svg',
  'cub-22.svg',
  'cub-23.svg',
  'cub-24.svg',
  'cub-25.svg',
  'cub-26.svg',
  'cub-27.svg',
  'cub-28.svg',
  'cub-29.svg',
  'cub-30.svg',
  'cub-31.svg',
  'cub-33.svg',
  'cub-34.svg',
  'cub-35.svg',
] as const;

export const AVATAR_DICTIONARY = AVATAR_OPTIONS.reduce(
  (acc, avatar) => {
    acc[avatar] = import(`@/images/personal-avatars/${avatar}`).then(
      (m) => m.default,
    );

    return acc;
  },
  {} as Record<PersonalAvatarName, Promise<string>>,
);

export const getAvatarDataUri = (name: PersonalAvatarName) => {
  return AVATAR_DICTIONARY[name];
};

export type PersonalAvatarName = (typeof AVATAR_OPTIONS)[number];
