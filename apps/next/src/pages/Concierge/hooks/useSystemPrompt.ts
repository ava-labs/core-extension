import { useMemo } from 'react';
import { systemPromptTemplate } from '../model';

interface UseSystemPromptParams {
  network: any;
  networks: any[];
  tokens: any[];
  allAvailableTokens: any[];
  accounts: any;
  contacts: any[];
  transferableAssets: any[];
  enabledNetworks: number[];
}

export const useSystemPrompt = ({
  network,
  networks,
  tokens,
  allAvailableTokens,
  accounts,
  contacts,
  transferableAssets,
  enabledNetworks,
}: UseSystemPromptParams) => {
  return useMemo(() => {
    if (!network || !tokens || !accounts) {
      return '';
    }
    return systemPromptTemplate
      .replace(
        '__TOKENS__',
        JSON.stringify(
          tokens.map((token) => ({
            name: token.name,
            symbol: token.symbol,
            balance: token.balanceDisplayValue,
          })),
          (_, v) => (typeof v === 'bigint' ? v.toString() : v),
        ),
      )
      .replace(
        '__AVAILABLE_TOKENS__',
        JSON.stringify(
          allAvailableTokens.map((token) => ({
            name: token.name,
            symbol: token.symbol,
            balance: token.balanceDisplayValue,
          })),
          (_, v) => (typeof v === 'bigint' ? v.toString() : v),
        ),
      )
      .replace(
        '__NETWORKS__',
        JSON.stringify(
          networks.map((n) => ({
            id: n.caipId,
            name: n.chainName,
            isTestnet: n.isTestnet,
            vmName: n.vmName,
            chainId: n.chainId,
          })),
        ),
      )
      .replace(
        '__CURRENT_NETWORK_ID__',
        JSON.stringify({
          id: network.caipId,
          name: network.chainName,
          isTestnet: network.isTestnet,
        }),
      )
      .replace('__CONTACTS__', JSON.stringify(contacts))
      .replace(
        '__ACCOUNTS__',
        JSON.stringify(
          [
            ...Object.values(accounts.primary).flat(),
            ...Object.values(accounts.imported),
          ].map((a: any) => ({
            name: a.name,
            id: a.id,
            address: a.addressC,
            active: a.id === accounts.active?.id,
          })),
        ),
      )
      .replace(
        '__BRIDGE_DATA__',
        JSON.stringify(
          transferableAssets.map((token) => ({
            name: token.name,
            symbol: token.symbol,
          })),
          (_, v) => (typeof v === 'bigint' ? v.toString() : v),
        ),
      )
      .replace(
        '__ENABLED_NETWORKS__',
        JSON.stringify(
          enabledNetworks.map((id) => ({
            chainId: id,
          })),
        ),
      );
  }, [
    network,
    tokens,
    accounts,
    allAvailableTokens,
    networks,
    contacts,
    transferableAssets,
    enabledNetworks,
  ]);
};
