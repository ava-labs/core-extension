import { useConnectedSites } from '@/hooks/useConnectedSites';
import {
  Button,
  Divider,
  IconButton,
  Popover,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { getAllAddressesForAccount } from '@core/common';
import { Account } from '@core/types';
import { useCurrentDomain } from '@core/ui/src/hooks/useCurrentDomain';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MdChevronRight,
  MdError,
  MdOutlineRemoveModerator,
} from 'react-icons/md';
import { StackRow } from '../StackRow';
import { useDappScansCache } from '@/hooks/useDappScansCache';
import { useNavigation } from '@core/ui';

interface ConnectedSitesProps {
  activeAccount?: Account;
}

export const ConnectedSites = ({ activeAccount }: ConnectedSitesProps) => {
  const { push } = useNavigation('scale');
  const domain = useCurrentDomain();
  const { disconnectSite, connectedSites, isDomainConnectedToAccount } =
    useConnectedSites();
  const { isMaliciousDapp } = useDappScansCache();

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
      ? theme.palette.neutral['50']
      : theme.palette.neutral['900'];

  const [isDomainMalicious, setIsDomainMalicious] = useState(false);

  useEffect(() => {
    if (!domain || !activeAccount) {
      return;
    }

    isMaliciousDapp(domain).then(setIsDomainMalicious);
  }, [domain, activeAccount, isMaliciousDapp]);

  if (!isDomainMalicious || !isConnected) {
    return null;
  }

  return (
    <Stack>
      <IconButton size="small" onClick={handleConnectedSitesClick}>
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
              backgroundColor: theme.palette.text.primary,
            },
          },
        }}
      >
        <Stack width={1}>
          <StackRow
            sx={{
              padding: 1,
              justifyContent: 'center',
              alignItems: 'center',
              background: popoverHeadline,
              gap: 1,
            }}
            color="error.main"
          >
            <MdOutlineRemoveModerator color="currentColor" size={18} />
            <Typography variant="subtitle3">
              {t('Flagged as malicious. Disconnect now!')}
            </Typography>
          </StackRow>
          <StackRow
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 1.2,
            }}
          >
            <Typography variant="subtitle3" color="text.primary">
              {domain}
            </Typography>
            <Button
              variant="contained"
              size="xsmall"
              color="error"
              onClick={() => {
                disconnectSite(domain, activeAccount);
              }}
            >
              <Typography variant="subtitle3" color="text.primary">
                {t('Disconnect')}
              </Typography>
            </Button>
          </StackRow>
          <Divider />
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
            <Typography color="text.primary">
              {t('View All Connected Sites')}
            </Typography>
            <StackRow
              sx={{
                color: 'text.primary',
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
