import {
  Avatar,
  EmptySitesIcon,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Scrollbars,
  Stack,
  Tooltip,
  Typography,
  XIcon,
} from '@avalabs/core-k2-components';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { getAllAddressesForAccount } from '@core/common';
import { Account } from '@core/types';
import {
  useAccountsContext,
  useAnalyticsContext,
  usePermissionContext,
} from '@core/ui';
import { Trans, useTranslation } from 'react-i18next';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';

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
  if (!account) {
    return [];
  }
  return Object.values(list).filter((listItem: any) =>
    Object.keys(listItem?.accounts).some((address) =>
      getAllAddressesForAccount(account).includes(address),
    ),
  );
};

export function ConnectedSites({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const { revokeAddressPermission, permissions } = usePermissionContext();
  const { capture } = useAnalyticsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const connectedSitesList = getAccountConnectedSites({
    list: permissions,
    account: activeAccount,
  });

  return (
    <Stack
      sx={{
        width: `${width}`,
        height: '100%',
      }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Connected Sites')}
      />
      {!connectedSitesList.length && (
        <Stack sx={{ mt: 6 }}>
          <EmptySitesIcon sx={{ justifyContent: 'center', fontSize: '64px' }} />
          <Typography variant="h4" sx={{ textAlign: 'center', mt: 3, mb: 1 }}>
            {t('No Connected Sites')}
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: 'text.secondary' }}
          >
            {
              <Trans i18nKey='Connect your wallet via the <br /> "Connect Wallet" button on the site' />
            }
          </Typography>
        </Stack>
      )}
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        {!!connectedSitesList.length && (
          <List>
            {connectedSitesList.map((site: any, index) => {
              return (
                <ListItem
                  sx={{
                    justifyContent: 'space-between',
                    py: 1,
                    pl: 2,
                    pr: 5,
                    m: 0,
                    '&:hover': { borderRadius: 0 },
                  }}
                  key={site.domain}
                  data-testid={`connected-site-${index}`}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      data-testid={`connected-site-${index}-trash`}
                      onClick={() => {
                        if (activeAccount) {
                          capture('ConnectedSiteRemoved');
                          revokeAddressPermission(
                            site.domain,
                            getAllAddressesForAccount(activeAccount),
                          );
                        }
                      }}
                    >
                      <XIcon size={24} />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {site.domain.substring(0, 2).toUpperCase()}
                    </Avatar>
                  </ListItemIcon>
                  <Tooltip title={site.domain} wrapWithSpan={false}>
                    <ListItemText
                      sx={{
                        ml: 2,
                        my: 0,
                      }}
                      primaryTypographyProps={{
                        variant: 'body2',
                        sx: {
                          maxWidth: 1,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        },
                      }}
                    >
                      {site.domain}
                    </ListItemText>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
        )}
      </Scrollbars>
    </Stack>
  );
}
