import { Stack, styled } from '@avalabs/k2-alpine';

interface ContainerProps {
  showAccountInfoByDefault: boolean;
  avatarOnlyClass: string;
  accountInfoClass: string;
  addressListClass: string;
}

export const Container = styled('div', {
  shouldForwardProp: (prop) =>
    ![
      'showAccountInfoByDefault',
      'avatarOnlyClass',
      'accountInfoClass',
      'addressListClass',
    ].includes(prop as string),
})<ContainerProps>(
  ({
    theme,
    showAccountInfoByDefault,
    avatarOnlyClass,
    accountInfoClass,
    addressListClass,
  }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    minWidth: 0,
    overflow: 'visible',
    position: 'relative',
    // Invisible bridge to connect Container with AddressList for hover continuity
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '260px',
      height: '56px',
      pointerEvents: 'none',
    },
    '&:hover::after': {
      pointerEvents: 'auto',
    },
    [`& .${avatarOnlyClass}`]: {
      display: showAccountInfoByDefault ? 'none' : 'block',
    },
    [`& .${accountInfoClass}`]: {
      display: showAccountInfoByDefault ? 'flex' : 'none',
    },
    [`&:hover .${avatarOnlyClass}`]: {
      display: 'none',
    },
    [`&:hover .${accountInfoClass}`]: {
      display: 'flex',
    },
    [`&:hover .${addressListClass}`]: {
      opacity: 1,
      transform: 'scale(1)',
      visibility: 'visible',
    },
  }),
);

export const AccountInfoClickableStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0.75, 0.5),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.navBarItem,
  cursor: 'pointer',
}));
