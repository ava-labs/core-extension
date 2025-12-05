import { Stack, toast } from '@avalabs/k2-alpine';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountSelect } from '@/components/AccountSelect';
import { Card } from '@/components/Card';
import { Page } from '@/components/Page';
import { useConnectedSites } from '@/hooks/useConnectedSites';
import { useUrlPersistedQuery } from '@/hooks/useUrlPersistedQuery';
import { Account } from '@core/types';
import { useAnalyticsContext } from '@core/ui';
import { ConnectedSiteItem, EmptyConnectedSites, Styled } from './components';
import { useDappScansCache } from '@/hooks/useDappScansCache';

export const ConnectedSites: FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useUrlPersistedQuery('search');
  const { capture } = useAnalyticsContext();

  const { selectedAccount, connectedSites, selectAccount, disconnectSite } =
    useConnectedSites();
  const { removeMaliciousDappDomain } = useDappScansCache();

  const filteredSites = useMemo(() => {
    if (!searchQuery?.trim()) {
      return connectedSites;
    }

    const query = searchQuery.toLowerCase();
    return connectedSites.filter((site) =>
      site.domain.toLowerCase().includes(query),
    );
  }, [connectedSites, searchQuery]);

  const handleAccountChange = useCallback(
    async (account: Account) => {
      try {
        await selectAccount(account.id);
      } catch (_error) {
        toast.error(t('Failed to change account'));
      }
    },
    [selectAccount, t],
  );

  const handleDisconnect = useCallback(
    async (domain: string) => {
      try {
        await disconnectSite(domain, selectedAccount);
        await removeMaliciousDappDomain(domain);
        toast.success(t('Disconnected from {{domain}}', { domain }));
        capture('ConnectedSiteRemoved');
      } catch (error) {
        console.error('Failed to disconnect:', error);
        toast.error(t('Failed to disconnect from site'));
      }
    },
    [disconnectSite, selectedAccount, t, removeMaliciousDappDomain, capture],
  );

  const connectedSitesCount = connectedSites.length;
  return (
    <Page
      title={
        connectedSitesCount > 0
          ? t('{{sitesCount}} Connected sites', {
              sitesCount: connectedSitesCount,
            })
          : t('Connected sites')
      }
      withBackButton
      contentProps={{
        gap: 2,
        width: 1,
        height: 1,
        justifyContent: undefined,
        alignItems: undefined,
      }}
    >
      <AccountSelect
        addressType="C" // TODO: fixed to EVM for now
        value={selectedAccount}
        onValueChange={handleAccountChange}
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />

      <Styled.SearchField
        placeholder={t('Search')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        autoFocus
        disabled={connectedSitesCount === 0}
      />

      {filteredSites.length > 0 ? (
        <Stack gap={1}>
          {filteredSites.map((site) => (
            <Card key={site.domain}>
              <ConnectedSiteItem
                site={site}
                onDisconnect={() => handleDisconnect(site.domain)}
              />
            </Card>
          ))}
        </Stack>
      ) : (
        <EmptyConnectedSites hasSearchQuery={!!searchQuery?.trim()} />
      )}
    </Page>
  );
};
