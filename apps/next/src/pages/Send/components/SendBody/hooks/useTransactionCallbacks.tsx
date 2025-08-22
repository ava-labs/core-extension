import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon, IconButton, toast } from '@avalabs/k2-alpine';

import {
  getExplorerAddressByNetwork,
  isUserRejectionError,
  openNewTab,
} from '@core/common';
import { NetworkWithCaipId } from '@core/types';

const TOAST_ID = 'send-result';

export const useTransactionCallbacks = (network: NetworkWithCaipId) => {
  const { t } = useTranslation();
  const { replace } = useHistory();

  return {
    // When transaction is successfully sent to the network
    onSendSuccess: (hash: string) => {
      // Redirect to home page
      replace('/');

      toast.success(t('Transaction successful'), {
        id: TOAST_ID,
        action: <ExplorerLink network={network} hash={hash} />,
      });
    },
    // When transaction could not be sent to the network or failed immediately
    onSendFailure: (err: unknown) => {
      console.error('Failed to send transaction:', err);

      if (!isUserRejectionError(err)) {
        toast.error(t('Failed to send the transaction'), { id: TOAST_ID });
      }
    },
  };
};

const ExplorerLink = ({
  network,
  hash,
}: {
  network: NetworkWithCaipId;
  hash: string;
}) => (
  <IconButton
    size="small"
    sx={{ color: 'background.default' }}
    onClick={() => {
      toast.dismiss(TOAST_ID);
      openNewTab({
        url: getExplorerAddressByNetwork(network, hash, 'tx'),
      });
    }}
  >
    <ChevronRightIcon />
  </IconButton>
);
