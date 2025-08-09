import { useConnectedSites } from '@/hooks/useConnectedSites';
import {
  Button,
  Divider,
  getHexAlpha,
  IconButton,
  Popover,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { getAllAddressesForAccount } from '@core/common';
import { Account } from '@core/types';
import { useCurrentDomain } from '@core/ui/src/hooks/useCurrentDomain';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MdCheckCircle,
  MdChevronRight,
  MdError,
  MdOutlineRemoveModerator,
  MdOutlineUnpublished,
} from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { StackRow } from '../StackRow';

interface ConnectedSitesProps {
  activeAccount?: Account;
}

export const ConnectedSites = ({ activeAccount }: ConnectedSitesProps) => {
  const { push } = useHistory();
  const domain = useCurrentDomain();
  const { disconnectSite, connectedSites, isDomainConnectedToAccount } =
    useConnectedSites();

  const theme = useTheme();
  const { t } = useTranslation();
  const isConnected =
    domain &&
    activeAccount &&
    isDomainConnectedToAccount(
      domain,
      getAllAddressesForAccount(activeAccount),
    );

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
    <Stack>
      <IconButton size="small" onClick={handleConnectedSitesClick}>
        {isConnected && !isDomainMalicious && (
          <MdCheckCircle size={24} color={theme.palette.success.main} />
        )}
        {!isConnected && <MdOutlineUnpublished size={24} />}
        {isConnected && isDomainMalicious && (
          <MdError size={24} color={theme.palette.error.main} />
        )}
      </IconButton>
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
        <Stack width={1}>
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
                  disconnectSite(domain!, activeAccount);
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
            onClick={() => push('/settings/connected-sites')}
            role="button"
            tabIndex={0}
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
              <Typography>{connectedSites.length}</Typography>
              <MdChevronRight size={20} />
            </StackRow>
          </StackRow>
        </Stack>
      </Popover>
    </Stack>
  );
};
