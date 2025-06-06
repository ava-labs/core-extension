import {
  AvatarHex,
  Box,
  BoxProps,
  combineSx,
  useTheme,
} from '@avalabs/k2-alpine';
import { use } from 'react';
import { memoize } from 'lodash';
import { useTranslation } from 'react-i18next';

import { AVATAR_DICTIONARY, PersonalAvatarName } from './avatar-dictionary';

type PersonalAvatarSharedProps = {
  isGlowing?: boolean;
  size?: 'small' | 'medium' | 'large';
  selected?: boolean;
  dimmed?: boolean;
};

type PersonalAvatarByNameProps = PersonalAvatarSharedProps & {
  name: PersonalAvatarName;
};

type PersonalAvatarByDataUriProps = PersonalAvatarSharedProps & {
  dataUri: string;
};

type PersonalAvatarProps = BoxProps &
  (PersonalAvatarByNameProps | PersonalAvatarByDataUriProps);

const getAvatarSrc = memoize((src: string): Promise<string> => {
  if (src in AVATAR_DICTIONARY) {
    return AVATAR_DICTIONARY[src];
  }

  return Promise.resolve(src);
});

export const PersonalAvatar = ({
  size = 'medium',
  selected = false,
  dimmed,
  sx,
  onClick,
  isGlowing,
  ...props
}: PersonalAvatarProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const src = use(getAvatarSrc('name' in props ? props.name : props.dataUri));
  const alt = 'name' in props ? props.name : t('your avatar');

  return (
    <Box
      position="relative"
      onClick={onClick}
      aria-selected={selected}
      role={onClick ? 'radio' : 'presentation'}
      tabIndex={onClick ? 0 : -1}
      sx={combineSx(
        {
          position: 'relative',
          transition: 'opacity .1s ease-in-out',
          cursor: onClick ? 'pointer' : 'default',
          opacity: dimmed ? (selected ? 1 : 0.6) : 1,
          '&:hover, &:focus, &:active, &:focus-visible': {
            outline: 0,
            opacity: 1,
          },
        },
        isGlowing
          ? {
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '10px',
                width: '100%',
                height: '100%',
                padding: theme.spacing(3),
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                filter: 'blur(20px)',
                opacity: 0.6,
              },
            }
          : null,
        sx,
      )}
      {...props}
    >
      <AvatarHex
        alt={alt}
        size={size}
        src={src}
        // @ts-expect-error - Missing property in @avalabs/k2-alpine
        selected={selected}
      />
    </Box>
  );
};
