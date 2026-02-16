import { Slide, Stack } from '@avalabs/k2-alpine';
import { ActivityFilterSelector } from '../../ActivityTab/components/ActivityFilterSelector';

import { FC, Suspense, useState } from 'react';
import { ActivityFilter } from '../../ActivityTab/types';
import { useTokenHistory } from '../hooks/useTokenHistory';
import { TransactionListSkeleton } from '../../ActivityTab/components/TransactionList';
import { HistoryList } from '../../ActivityTab/components/TransactionList/components/HistoryList';
import { useUrlState } from '../hooks/useUrlState';
import { NoTokenActivity } from './NoTokenActivity';
import { NetworkWithCaipId } from '@core/types';
import { ExplorerButton } from './ExplorerButton';
import { useTranslation } from 'react-i18next';

type Props = {
  networkId: number; //From params
  tokenAddress: string; //From params
  network: NetworkWithCaipId;
};
export const GeneralTokenDetails: FC<Props> = ({
  networkId,
  tokenAddress,
  network,
}) => {
  const { t } = useTranslation();
  const urlState = useUrlState();
  const initialFilter = urlState.filter ?? 'All';

  const [filter, setFilter] = useState<ActivityFilter>(initialFilter);

  const transactionHistory = useTokenHistory({
    networkId,
    tokenAddress,
  });

  if (transactionHistory.length === 0) {
    return <NoTokenActivity network={network} />;
  }

  return (
    <>
      <Stack direction="row" gap={1.25} mb={2}>
        <Slide direction="right" in>
          <ActivityFilterSelector
            selected={filter}
            exclude={['NFT']}
            onChange={(newFilter) => {
              setFilter(newFilter);
              urlState.update(newFilter, networkId, tokenAddress, 'activity');
            }}
          />
        </Slide>
      </Stack>
      <Suspense fallback={<TransactionListSkeleton />}>
        <HistoryList filter={filter} transactionHistory={transactionHistory} />
        <ExplorerButton network={network} buttonText={t('View full history')} />
      </Suspense>
    </>
  );
};
