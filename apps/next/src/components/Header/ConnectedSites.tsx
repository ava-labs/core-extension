import {
  Button,
  Divider,
  getHexAlpha,
  Popover,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { StackRow } from '../StackRow';
import {
  MdCheckCircle,
  MdChevronRight,
  MdError,
  MdOutlineRemoveModerator,
  MdOutlineUnpublished,
} from 'react-icons/md';
import { usePermissionContext } from '@core/ui';
import { getAllAddressesForAccount } from '@core/common';
import { Account } from '@core/types';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useCurrentDomain } from '@/pages/Permissions/useCurrentDomain';
import { NetworkVMType } from '@avalabs/vm-module-types';

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

export const ConnectedSites = ({ activeAccount }) => {
  const domain = useCurrentDomain();
  const { permissions, revokeAddressPermisson, isDomainConnectedToAccount } =
    usePermissionContext();
  const connectedSitesList = getAccountConnectedSites({
    list: permissions,
    account: activeAccount,
  });
  const theme = useTheme();
  const { t } = useTranslation();
  const isConnected =
    (isDomainConnectedToAccount &&
      isDomainConnectedToAccount(
        domain,
        getAllAddressesForAccount(activeAccount ?? {}),
      )) ||
    false;

  const handleConnectedSitesClose = () => {
    setConnectedSitesAnchorEl(null);
  };
  const [connectedSitesAnchorEl, setConnectedSitesAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const handleConnectedSitesClick = (event) => {
    setConnectedSitesAnchorEl(event.currentTarget);
  };

  const connectedSitesPopoverOpen = !!connectedSitesAnchorEl;
  const popoverHeadline =
    theme.palette.mode === 'dark'
      ? theme.palette.common['white_10']
      : theme.palette.neutral['850_10'];

  const popoverBackground =
    theme.palette.mode === 'dark'
      ? theme.palette.neutral['850_90']
      : theme.palette.common['white_60'];

  // TODO: implement a getter for the dApp property `isDomainMalicious`
  const isDomainMalicious = false;

  return (
    <Stack sx={{ cursor: 'pointer' }}>
      {isConnected && !isDomainMalicious && (
        <MdCheckCircle
          size={24}
          color={theme.palette.success.main}
          onClick={handleConnectedSitesClick}
        />
      )}
      {!isConnected && (
        <MdOutlineUnpublished size={24} onClick={handleConnectedSitesClick} />
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
              <Typography color={theme.palette.error.light}>
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
                <Typography color={theme.palette.text.primary}>
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
                      background: getHexAlpha(theme.palette.error.main, 80),
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
                <Typography color={theme.palette.text.primary}>
                  {domain}
                </Typography>
                <Typography color={theme.palette.text.secondary}>
                  {t('Locate the connect button on their site')}
                </Typography>
                <Typography color={theme.palette.error.light}>
                  {t('Not connected')}
                </Typography>
              </Stack>
            </StackRow>
          )}
          <Divider
            sx={{ borderColor: getHexAlpha(theme.palette.primary.main, 10) }}
          />
          <StackRow
            // TODO: add redirect to the settings connected sites when it's ready
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: 1.2,
              alignItems: 'center',
            }}
          >
            <Typography color={theme.palette.text.primary}>
              {t('View All Connected Sites')}
            </Typography>
            <StackRow
              sx={{
                color: theme.palette.text.primary,
                alignItems: 'center',
              }}
            >
              <Typography>{connectedSitesList.length}</Typography>
              <MdChevronRight size={20} />
            </StackRow>
          </StackRow>
        </Stack>
      </Popover>
    </Stack>
  );
};
