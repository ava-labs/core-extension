import {
  Stack,
  useTheme,
  getHexAlpha,
  Select,
  MenuItem,
  styled,
  Typography,
  AvatarHex,
  AvalancheColorIcon,
  Button,
  toast,
  Popover,
  PopoverContent,
  PopoverItem,
  keyframes,
  TruncateText,
  AvalancheIcon,
  Divider,
  CChainIcon,
} from '@avalabs/k2-alpine';
import { useAccountsContext, usePermissionContext } from '@core/ui';
import {
  MdChevronRight,
  MdOutlineRemoveModerator,
  MdOutlineUnfoldMore,
  MdQrCode2,
  MdRemoveModerator,
} from 'react-icons/md';
import { MdOutlineUnpublished } from 'react-icons/md';
import { MdCheckCircle } from 'react-icons/md';
import { MdOutlineSettings } from 'react-icons/md';
import { MdError } from 'react-icons/md';
import { AVATAR_OPTIONS, PersonalAvatar } from '../PersonalAvatar';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StackRow } from '../StackRow';
import { TypographyBold } from '../TypographyBold';
import { Permissions, Account } from '@core/types';
import { getAllAddressesForAccount } from '@core/common';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { AddressItem } from '@/pages/AccountManagement/components/Wallets/components/AccountContextMenu/components/AddressItem';

const AccountInfo = styled(Stack)(({ theme }) => ({
  cursor: 'pointer',
  background: 'red',
  borderRadius: '10px',
  padding: theme.spacing(0.5),
  ':hover': {
    background: 'blue',
  },
  flexDirection: 'row',
  alignItems: 'center',
  gap: 1,
}));

const AccountSelectContainer = styled(Stack)`
  cursor: pointer;
`;

CSS.registerProperty({
  name: '--angle',
  syntax: '<angle>',
  inherits: false,
  initialValue: '0deg',
});

const promptBackgroundAnimation = keyframes`
  to {
	  --angle: 360deg;
	}
`;
export const PromptButtonBackground = styled(Stack)(() => ({
  background: `conic-gradient(
      from var(--angle),
      #26F2FF 0deg,
      #7748FF 180deg,
      #FF048C 330deg
    )`,
  animation: `10s ${promptBackgroundAnimation} linear infinite`,
  width: '360px',
  height: '36px',
  flexShrink: 0,
  filter: ' blur(15px)',
  position: 'absolute',
  top: '20px',
}));

type ConnectedListType = {
  [key: string]: {
    accounts: {
      [key: string]: NetworkVMType;
    };
  };
};

const getAccountConnectedSites = ({
  list,
  account,
}: {
  list: ConnectedListType;
  account?: Account;
}) => {
  if (!account || !list) {
    return [];
  }
  return Object.values(list).filter((listItem: any) =>
    Object.keys(listItem?.accounts).some((address) =>
      getAllAddressesForAccount(account).includes(address),
    ),
  );
};

export const Header = () => {
  const { accounts } = useAccountsContext();
  const activeAccount = accounts.active;
  const theme = useTheme();
  const { t } = useTranslation();
  const { permissions } = usePermissionContext();
  const connectedSitesList = getAccountConnectedSites({
    list: permissions,
    account: activeAccount,
  });

  const [addressesAnchorEl, setAddressesAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const [connectedSitesAnchorEl, setConnectedSitesAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  console.log('connectedSitesAnchorEl: ', connectedSitesAnchorEl);

  const addressesPopoverOpen = !!addressesAnchorEl;
  const connectedSitesPopoverOpen = !!connectedSitesAnchorEl;
  console.log('connectedSitesPopoverOpen: ', connectedSitesPopoverOpen);

  const handleAddressClick = (event) => {
    setAddressesAnchorEl(event.currentTarget);
  };
  const handleConnectedSitesClick = (event) => {
    setConnectedSitesAnchorEl(event.currentTarget);
  };

  const handleAddressClose = () => {
    setAddressesAnchorEl(null);
  };
  const handleConnectedSitesClose = () => {
    console.log('handleConnectedSitesClose: ');
    setConnectedSitesAnchorEl(null);
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    toast.success('Copied!', { duration: 2000 });
  };

  console.log('theme: ', theme);
  console.log('accounts: ', accounts);
  return (
    <>
      <Stack
        sx={{
          position: 'relative',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: theme.zIndex.appBar,
        }}
      >
        <StackRow
          sx={{
            background: theme.palette.background.default,
            width: '100%',
            height: '56px',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1,
            zIndex: 1,
          }}
        >
          <AccountSelectContainer>
            <AccountInfo onClick={handleAddressClick}>
              <PersonalAvatar
                name={AVATAR_OPTIONS[0]}
                size="xsmall"
                sx={{ display: 'flex' }}
              />
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                {activeAccount?.name}
              </Typography>
              <MdOutlineUnfoldMore size={24} color="neutral.850_60" />
            </AccountInfo>
            <Popover
              open={addressesPopoverOpen}
              anchorEl={addressesAnchorEl}
              onClose={handleAddressClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              slotProps={{
                paper: { style: { width: '300px' } },
              }}
            >
              <AddressItem
                label="Avalanche C-Chain"
                Icon={CChainIcon}
                address={activeAccount?.addressC}
                onClose={handleAddressClose}
              />
              {/* <StackRow sx={{ alignItems: 'center' }}>
                <AvalancheColorIcon size={20} />
                <Stack>
                  <StackRow sx={{ alignItems: 'center' }}>
                    <Stack>
                      <TypographyBold variant="caption">
                        Avalanche C-Chain
                      </TypographyBold>
                      <TruncateText>{activeAccount?.addressC}</TruncateText>
                    </Stack>
                    <Button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        copyAddress(activeAccount?.addressC);
                      }}
                    >
                      Copy
                    </Button>
                  </StackRow>
                  <Divider sx={{ width: '100%' }} />
                </Stack>
              </StackRow>
              <StackRow sx={{ alignItems: 'center' }}>
                <AvalancheIcon size={20} />
                <StackRow sx={{ alignItems: 'center' }}>
                  <Stack>
                    <TypographyBold variant="caption">
                      Avalanche C-Chain
                    </TypographyBold>
                    <TruncateText>{activeAccount?.addressC}</TruncateText>
                  </Stack>
                  <Button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      copyAddress(activeAccount?.addressC);
                    }}
                  >
                    Copy
                  </Button>
                </StackRow>
                <Divider />
              </StackRow> */}
            </Popover>
          </AccountSelectContainer>
          <Stack sx={{ flexDirection: 'row', gap: 1 }}>
            <Stack sx={{ cursor: 'pointer' }}>
              <MdCheckCircle
                size={24}
                color={theme.palette.success.main}
                onClick={handleConnectedSitesClick}
              />
              {/* <MdOutlineUnpublished size={24} />
          <MdError size={24} color={theme.palette.error.main} /> */}
              <Popover
                open={connectedSitesPopoverOpen}
                anchorEl={connectedSitesAnchorEl}
                onClose={handleConnectedSitesClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                slotProps={{
                  paper: { style: { width: '100%', padding: 0 } },
                }}
              >
                {/* <PopoverContent sx={{ width: '300px' }}> */}
                <Stack sx={{ width: '100%' }}>
                  <StackRow>
                    <MdOutlineRemoveModerator
                      color={theme.palette.error.light}
                      size={18}
                    />
                    <Typography sx={{ color: theme.palette.error.light }}>
                      {t('Flagged as malicious. Disconnect now!')}
                    </Typography>
                  </StackRow>
                  <StackRow
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Stack>
                      <Typography>{'domain2.com'}</Typography>
                      <Typography color={theme.palette.success.light}>
                        {t('Connected')}
                      </Typography>
                    </Stack>
                    <Button
                      onClick={() => {
                        console.log('disconnect');
                        // if (domain && activeAccount) {
                        //   revokeAddressPermisson(
                        //     domain,
                        //     getAllAddressesForAccount(activeAccount),
                        //   );
                        // }
                      }}
                      color="success"
                    >
                      {t('Disconnect')}
                    </Button>
                  </StackRow>
                  <StackRow
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Stack>
                      <Typography>{'domain.com'}</Typography>
                      <Typography>
                        {t('Locate the connect button on their site')}
                      </Typography>
                      <Typography color={theme.palette.error.light}>
                        {t('Not connected')}
                      </Typography>
                    </Stack>
                  </StackRow>
                  <Divider />
                  <StackRow
                    sx={{
                      // width: '300px',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      console.log('Go to settings');
                    }}
                  >
                    <Typography>{t('View All Connected Sites')}</Typography>
                    <Stack sx={{ flexDirection: 'row' }}>
                      <Typography>{connectedSitesList.length}</Typography>
                      <MdChevronRight size={20} />
                    </Stack>
                  </StackRow>
                  {/* </PopoverContent> */}
                </Stack>
              </Popover>
            </Stack>
            <MdQrCode2 size={24} />
            <MdOutlineSettings size={24} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <mask
                id="mask0_6447_2562"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="23"
                  height="23"
                  fill="#D9D9D9"
                  stroke="white"
                />
              </mask>
              <g mask="url(#mask0_6447_2562)">
                <mask id="path-2-inside-1_6447_2562" fill="white">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18 6H6C5.44772 6 5 6.44772 5 7V17C5 17.5523 5.44772 18 6 18H18C18.5523 18 19 17.5523 19 17V7C19 6.44772 18.5523 6 18 6ZM6 4C4.34315 4 3 5.34315 3 7V17C3 18.6569 4.34315 20 6 20H18C19.6569 20 21 18.6569 21 17V7C21 5.34315 19.6569 4 18 4H6Z"
                  />
                </mask>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18 6H6C5.44772 6 5 6.44772 5 7V17C5 17.5523 5.44772 18 6 18H18C18.5523 18 19 17.5523 19 17V7C19 6.44772 18.5523 6 18 6ZM6 4C4.34315 4 3 5.34315 3 7V17C3 18.6569 4.34315 20 6 20H18C19.6569 20 21 18.6569 21 17V7C21 5.34315 19.6569 4 18 4H6Z"
                  fill="#28282E"
                />
                <path
                  d="M6 8H18V4H6V8ZM7 7C7 7.55228 6.55229 8 6 8V4C4.34315 4 3 5.34315 3 7H7ZM7 17V7H3V17H7ZM6 16C6.55228 16 7 16.4477 7 17H3C3 18.6569 4.34315 20 6 20V16ZM18 16H6V20H18V16ZM17 17C17 16.4477 17.4477 16 18 16V20C19.6569 20 21 18.6569 21 17H17ZM17 7V17H21V7H17ZM18 8C17.4477 8 17 7.55229 17 7H21C21 5.34315 19.6569 4 18 4V8ZM5 7C5 6.44772 5.44772 6 6 6V2C3.23858 2 1 4.23858 1 7H5ZM5 17V7H1V17H5ZM6 18C5.44772 18 5 17.5523 5 17H1C1 19.7614 3.23858 22 6 22V18ZM18 18H6V22H18V18ZM19 17C19 17.5523 18.5523 18 18 18V22C20.7614 22 23 19.7614 23 17H19ZM19 7V17H23V7H19ZM18 6C18.5523 6 19 6.44772 19 7H23C23 4.23858 20.7614 2 18 2V6ZM6 6H18V2H6V6Z"
                  fill="white"
                  mask="url(#path-2-inside-1_6447_2562)"
                />
                <rect
                  x="16.5"
                  y="7.5"
                  width="1"
                  height="9"
                  rx="0.5"
                  stroke="white"
                />
              </g>
            </svg>
          </Stack>
        </StackRow>
        <PromptButtonBackground />
      </Stack>
    </>
  );
};
