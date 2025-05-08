import { TxDetailsRow } from '@/components/common/approval/TxDetailsRow';
import { useAccountsContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import { Network } from '@avalabs/core-chains-sdk';
import {
  AlertTriangleIcon,
  Button,
  ExternalLinkIcon,
  Link,
  LinkIcon,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { DomainMetadata } from '@core/types';
import {
  getExplorerAddressByNetwork,
  openNewTab,
  truncateAddress,
} from '@core/common';
import { useTranslation } from 'react-i18next';

type ContractDetailsProps = {
  contractAddress: string;
  network?: Network;
};
export const ContractDetails = ({
  contractAddress,
  network,
}: ContractDetailsProps) => {
  const { t } = useTranslation();

  return (
    <TxDetailsRow label={t('Contract')}>
      <Button
        sx={{
          p: 0,
          minWidth: 'auto',
          display: 'inline-flex',
        }}
        variant="text"
        color="primary"
        onClick={() =>
          network &&
          openNewTab({
            url: getExplorerAddressByNetwork(
              network,
              contractAddress,
              'address',
            ),
          })
        }
      >
        <ExternalLinkIcon size={14} />
      </Button>
      <Tooltip placement="top" title={contractAddress}>
        <Typography variant="caption">
          {truncateAddress(contractAddress)}
        </Typography>
      </Tooltip>
    </TxDetailsRow>
  );
};

type AccountDetailsProps = {
  address: string;
  label?: string;
};
export const AccountDetails = ({ address, label }: AccountDetailsProps) => {
  const { t } = useTranslation();
  const { getAccount } = useAccountsContext();
  const account = getAccount(address);

  return (
    <TxDetailsRow label={label || t('Account')}>
      <Tooltip title={address}>
        <Typography variant="caption">
          {account?.name ?? truncateAddress(address)}
        </Typography>
      </Tooltip>
    </TxDetailsRow>
  );
};

type WebsiteDetailsProps = {
  site: DomainMetadata;
};
export const WebsiteDetails = ({ site }: WebsiteDetailsProps) => {
  const { t } = useTranslation();

  // Do not show if request originated from the extension itself
  if (site.domain === location.hostname) {
    return null;
  }

  return (
    <TxDetailsRow label={t('Website')}>
      <Link
        href={`https://${site.domain}`}
        target="_blank"
        rel="noreferrer"
        sx={{ display: 'inline-flex', color: 'text.primary' }}
      >
        <LinkIcon size={14} />
      </Link>
      <Typography
        variant="caption"
        sx={{
          color: 'text.primary',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {site.domain}
      </Typography>
    </TxDetailsRow>
  );
};

type NetworkDetailsProps = {
  network: Network;
};
export const NetworkDetails = ({ network }: NetworkDetailsProps) => {
  const { t } = useTranslation();
  const { network: activeNetwork } = useNetworkContext();

  const showDifferentNetworkWarning =
    activeNetwork?.chainId !== network.chainId;

  return (
    <TxDetailsRow label={t('Network')}>
      {showDifferentNetworkWarning && (
        <Tooltip
          placement="bottom"
          title={t('Current network is different from this network')}
        >
          <AlertTriangleIcon
            sx={{ color: 'warning.main', cursor: 'pointer' }}
          />
        </Tooltip>
      )}
      <Typography variant="caption" sx={{ color: 'text.primary' }}>
        {network.chainName}
      </Typography>
    </TxDetailsRow>
  );
};
