import {
  AvatarHex,
  Box,
  BoxProps,
  combineSx,
  useTheme,
} from '@avalabs/k2-alpine';
import { memoize } from 'lodash';
import { ComponentProps, use } from 'react';
import { useTranslation } from 'react-i18next';

import { AVATAR_DICTIONARY, PersonalAvatarName } from './avatar-dictionary';
import { usePersonalAvatar } from './context';

type OnlyOne<T extends object> = {
  [K in keyof T]: Pick<T, K> & {
    [Excluded in Exclude<keyof T, K>]?: never;
  };
}[keyof T];

type FallbackAvatar = '';

type PersonalAvatarSharedProps = {
  isGlowing?: boolean;
  size?: ComponentProps<typeof AvatarHex>['size'];
  selected?: boolean;
  dimmed?: boolean;
  alt?: string;
} & OnlyOne<{
  cached?: true;
  name: PersonalAvatarName | FallbackAvatar;
  dataUri: string;
}>;

type PersonalAvatarProps = BoxProps & PersonalAvatarSharedProps;

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
  cached,
  ...props
}: PersonalAvatarProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    selected: { dataUri: avatar },
  } = usePersonalAvatar();

  const src = use(
    getAvatarSrc(cached ? avatar : (props.name ?? props.dataUri ?? avatar)),
  );
  const alt = props.alt ?? props.name ?? t('your avatar')!;

  return (
    <Box
      position="relative"
      onClick={onClick}
      aria-selected={selected}
      role={onClick ? 'radio' : 'presentation'}
      tabIndex={onClick ? 0 : -1}
      data-testid={onClick ? 'avatar-option' : undefined}
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
      <AvatarHex alt={alt} size={size} src={src} selected={selected} />
    </Box>
  );
};
