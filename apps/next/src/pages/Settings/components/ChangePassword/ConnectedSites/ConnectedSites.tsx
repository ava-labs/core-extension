import { Divider, Stack, toast } from '@avalabs/k2-alpine';
import { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/Card';
import { Page } from '@/components/Page';
import { AccountSelector } from './components/AccountSelector';
import { ConnectedSiteItem } from './components/ConnectedSiteItem';
import { EmptyConnectedSites } from './components/EmptyConnectedSites';
import { SearchField } from './components/SearchField';
import { useConnectedSites } from './hooks/useConnectedSites';

export const ConnectedSites: FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    selectedAccount,
    accounts,
    connectedSites,
    selectAccount,
    disconnectSite,
  } = useConnectedSites();

  const filteredSites = useMemo(() => {
    if (!searchQuery?.trim()) {
      return connectedSites;
    }

    const query = searchQuery.toLowerCase();
    return connectedSites.filter(
      (site) =>
        site.domain.toLowerCase().includes(query) ||
        site.name?.toLowerCase().includes(query),
    );
  }, [connectedSites, searchQuery]);

  const handleAccountChange = useCallback(
    async (accountId: string) => {
      try {
        await selectAccount(accountId);
        toast.success(t('Active account changed'));
      } catch (error) {
        console.error('Failed to change account:', error);
        toast.error(t('Failed to change account'));
      }
    },
    [selectAccount, t],
  );

  const handleDisconnect = useCallback(
    async (domain: string) => {
      try {
        await disconnectSite(domain, selectedAccount);
        toast.success(t('Disconnected from {{domain}}', { domain }));
      } catch (error) {
        console.error('Failed to disconnect:', error);
        toast.error(t('Failed to disconnect from site'));
      }
    },
    [disconnectSite, selectedAccount, t],
  );

  const connectedSitesCount = connectedSites.length;
  return (
    <Page
      title={`${connectedSitesCount} ${t('Connected sites')}`}
      withBackButton
      contentProps={{
        gap: 2,
        width: 1,
        height: 1,
        justifyContent: undefined,
        alignItems: undefined,
      }}
    >
      {/* Account selector */}
      <AccountSelector
        selectedAccount={selectedAccount}
        accounts={accounts}
        onChange={handleAccountChange}
      />

      {/* Search field */}
      <SearchField
        placeholder={t('Search')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        autoFocus
      />

      {/* Connected sites list */}
      {filteredSites.length > 0 ? (
        <Card>
          <Stack divider={<Divider />}>
            {filteredSites.map((site) => (
              <ConnectedSiteItem
                key={site.domain}
                site={site}
                onDisconnect={() => handleDisconnect(site.domain)}
              />
            ))}
          </Stack>
        </Card>
      ) : (
        <EmptyConnectedSites hasSearchQuery={!!searchQuery?.trim()} />
      )}
    </Page>
  );
};
