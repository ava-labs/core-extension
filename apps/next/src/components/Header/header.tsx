import {
  Stack,
  useTheme,
  getHexAlpha,
  styled,
  Typography,
  Button,
  Popover,
  keyframes,
  CChainIcon,
  XPChainIcon,
  SolanaColorIcon,
  EthereumColorIcon,
  BitcoinColorIcon,
  SidebarIcon,
  SidebarDockIcon,
  SidebarUndockIcon,
} from '@avalabs/k2-alpine';
import { useAccountsContext, usePermissionContext } from '@core/ui';
import {
  MdChevronRight,
  MdOutlineRemoveModerator,
  MdOutlineUnfoldMore,
  MdQrCode2,
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
import { Account } from '@core/types';
import { getAllAddressesForAccount } from '@core/common';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { AccountItem } from './Account/AccountItems';
import { useCurrentDomain } from '@/pages/Permissions/useCurrentDomain';

const AccountInfo = styled(Stack)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: '10px',
  padding: theme.spacing(0.5),
  transition: theme.transitions.create(['background', 'opacity']),
  '& > svg ': {
    opacity: 0,
  },
  ':hover': {
    background: getHexAlpha(theme.palette.primary.main, 10),
    '& > svg ': {
      opacity: 1,
    },
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

// TODO: implement the Icon change logic
const StackRowStyled = styled(StackRow)`
  cursor: pointer;
  & > .sidebarUndockIcon {
    display: none;
  }
  & > .sidebarDockIcon {
    display: none;
  }
  &:hover > .sidebarIcon {
    display: none;
  }
  &:hover > .sidebarDockIcon {
    display: block;
  }
`;

export const Header = () => {
  const domain = useCurrentDomain();
  const { accounts } = useAccountsContext();
  const activeAccount = accounts.active;
  const theme = useTheme();
  const { t } = useTranslation();
  const { permissions, revokeAddressPermisson, isDomainConnectedToAccount } =
    usePermissionContext();
  const connectedSitesList = getAccountConnectedSites({
    list: permissions,
    account: activeAccount,
  });

  const isConnected =
    (isDomainConnectedToAccount &&
      isDomainConnectedToAccount(
        domain,
        getAllAddressesForAccount(activeAccount ?? {}),
      )) ||
    false;
  // TODO: implement a getter for the sidebar funcionality
  const isSidebar = false;
  // TODO: implement a getter for the dApp property `isDomainMalicious`
  const isDomainMalicious = false;

  const popoverBackground =
    theme.palette.mode === 'dark'
      ? //@ts-expect-error type error from K2
        theme.palette.neutral['850_60']
      : theme.palette.common['white_60'];

  const popoverHeadline =
    theme.palette.mode === 'dark'
      ? theme.palette.common['white_10']
      : //@ts-expect-error type error from K2
        theme.palette.neutral['850_10'];

  const [addressesAnchorEl, setAddressesAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const [connectedSitesAnchorEl, setConnectedSitesAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const addressesPopoverOpen = !!addressesAnchorEl;
  const connectedSitesPopoverOpen = !!connectedSitesAnchorEl;

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
    setConnectedSitesAnchorEl(null);
  };

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
                sx={{ display: 'flex', marginRight: 1 }}
              />
              <TypographyBold variant="body1">
                {activeAccount?.name}
              </TypographyBold>
              <MdOutlineUnfoldMore
                size={24}
                color={getHexAlpha(theme.palette.primary.main, 70)}
              />
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
                paper: {
                  style: {
                    width: '250px',
                    background: popoverBackground,
                    border: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
                  },
                },
              }}
            >
              <AccountItem
                label="Avalanche C-Chain"
                Icon={CChainIcon}
                address={activeAccount?.addressC}
                onClose={handleAddressClose}
              />
              <AccountItem
                label="Avalanche X-Chain"
                Icon={XPChainIcon}
                address={activeAccount?.addressAVM}
                onClose={handleAddressClose}
              />
              <AccountItem
                label="Bitcoin"
                Icon={BitcoinColorIcon}
                address={activeAccount?.addressBTC}
                onClose={handleAddressClose}
              />
              <AccountItem
                label="Ethereum"
                Icon={EthereumColorIcon}
                address={activeAccount?.addressC}
                onClose={handleAddressClose}
              />
              <AccountItem
                label="Solana"
                Icon={SolanaColorIcon}
                address={activeAccount?.addressSVM}
                onClose={handleAddressClose}
                lastElement
              />
            </Popover>
          </AccountSelectContainer>
          <Stack sx={{ flexDirection: 'row', gap: 1 }}>
            <Stack sx={{ cursor: 'pointer' }}>
              {isConnected && (
                <MdCheckCircle
                  size={24}
                  color={theme.palette.success.main}
                  onClick={handleConnectedSitesClick}
                />
              )}
              {!isConnected && (
                <MdOutlineUnpublished
                  size={24}
                  onClick={handleConnectedSitesClick}
                />
              )}
              {isConnected && isDomainMalicious && (
                <MdError
                  size={24}
                  color={theme.palette.error.main}
                  onClick={handleConnectedSitesClick}
                />
              )}
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
                  paper: {
                    style: {
                      width: '300px',
                      background: popoverBackground,
                      border: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
                    },
                  },
                }}
              >
                <Stack
                  sx={{
                    width: '100%',
                  }}
                >
                  {isConnected && isDomainMalicious && (
                    <StackRow
                      sx={{
                        padding: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: popoverHeadline,
                        gap: 1,
                      }}
                    >
                      <MdOutlineRemoveModerator
                        color={theme.palette.error.light}
                        size={18}
                      />
                      <Typography sx={{ color: theme.palette.error.light }}>
                        {t('Flagged as malicious. Disconnect now!')}
                      </Typography>
                    </StackRow>
                  )}
                  {isConnected && (
                    <StackRow
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 1.2,
                      }}
                    >
                      <Stack>
                        <Typography sx={{ color: theme.palette.text.primary }}>
                          {domain}
                        </Typography>
                        <Typography color={theme.palette.success.light}>
                          {t('Connected')}
                        </Typography>
                      </Stack>
                      <Button
                        onClick={() => {
                          // TODO: implement after the function works
                          if (domain && activeAccount) {
                            revokeAddressPermisson(
                              domain,
                              getAllAddressesForAccount(activeAccount),
                            );
                          }
                        }}
                        sx={{
                          '&.MuiButton-root.MuiButton-text': {
                            background: theme.palette.error.main,
                            color: theme.palette.common.white,
                            '&:hover': {
                              background: getHexAlpha(
                                theme.palette.error.main,
                                80,
                              ),
                            },
                          },
                        }}
                      >
                        {t('Disconnect')}
                      </Button>
                    </StackRow>
                  )}
                  {!isConnected && (
                    <StackRow
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 1.2,
                      }}
                    >
                      <Stack>
                        <Typography sx={{ color: theme.palette.text.primary }}>
                          {domain}
                        </Typography>
                        <Typography
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {t('Locate the connect button on their site')}
                        </Typography>
                        <Typography color={theme.palette.error.light}>
                          {t('Not connected')}
                        </Typography>
                      </Stack>
                    </StackRow>
                  )}
                  <hr
                    style={{
                      width: '100%',
                      paddingTop: theme.spacing(1),
                      border: 'none',
                      borderBottom: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
                    }}
                  />
                  <StackRow
                    sx={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      padding: 1.2,
                    }}
                    onClick={() => {}}
                  >
                    <Typography sx={{ color: theme.palette.text.primary }}>
                      {t('View All Connected Sites')}
                    </Typography>
                    <Stack
                      sx={{
                        flexDirection: 'row',
                        color: theme.palette.text.primary,
                      }}
                    >
                      <Typography>{connectedSitesList.length}</Typography>
                      <MdChevronRight size={20} />
                    </Stack>
                  </StackRow>
                </Stack>
              </Popover>
            </Stack>
            <MdQrCode2 size={24} />
            <MdOutlineSettings size={24} />
            <StackRowStyled>
              <SidebarIcon size={24} className="sidebarIcon" />
              {isSidebar && (
                <SidebarUndockIcon size={24} className="sidebarUndockIcon" />
              )}
              {!isSidebar && (
                <SidebarDockIcon size={24} className="sidebarDockIcon" />
              )}
            </StackRowStyled>
          </Stack>
        </StackRow>
        <PromptButtonBackground />
      </Stack>
    </>
  );
};
