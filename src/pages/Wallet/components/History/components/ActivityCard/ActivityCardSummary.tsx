import { Typography } from '@avalabs/core-k2-components';
import { TransactionType } from '@src/background/services/history/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { truncateAddress } from '@src/utils/truncateAddress';
import { useTranslation } from 'react-i18next';
import { useBlockchainNames } from '../../useBlockchainNames';
import { ActivityCardProp } from './ActivityCard';

export function ActivityCardSummary({ historyItem }: ActivityCardProp) {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { sourceBlockchain, targetBlockchain } =
    useBlockchainNames(historyItem);
  const { t } = useTranslation();

  if (historyItem.txType === TransactionType.BRIDGE || historyItem.isBridge) {
    return (
      <Typography
        variant="caption"
        sx={(theme) => ({ color: theme.palette.primary.dark })}
      >
        {sourceBlockchain} -&gt; {targetBlockchain}
      </Typography>
    );
  } else if (historyItem.txType === TransactionType.SWAP) {
    const sourceToken = historyItem.tokens.find(
      (token) => token.from?.address === activeAccount?.addressC
    );

    const targetToken = historyItem.tokens.find(
      (token) => token.to?.address === activeAccount?.addressC
    );

    return (
      <Typography
        variant="caption"
        sx={(theme) => ({ color: theme.palette.primary.dark })}
      >
        {sourceToken?.symbol} -&gt; {targetToken?.symbol}
      </Typography>
    );
  }

  const txDirection = historyItem.isSender ? t('To') : t('From');
  const txAddress = historyItem.isSender ? historyItem.to : historyItem.from;

  return (
    <Typography
      variant="caption"
      sx={(theme) => ({ color: theme.palette.primary.dark })}
    >
      {txDirection}: {truncateAddress(txAddress)}
    </Typography>
  );
}
