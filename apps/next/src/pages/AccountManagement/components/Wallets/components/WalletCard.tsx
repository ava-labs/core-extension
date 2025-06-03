import { AccordionDetails, CircularProgress, Stack } from '@avalabs/k2-alpine';
import { WalletDetails } from '@core/types';
import {
  useAccountsContext,
  useSettingsContext,
  useWalletTotalBalance,
} from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdErrorOutline } from 'react-icons/md';
import { Typography } from '../../Typography';
import AccountListItem from './AccountListItem';
import * as Styled from './Styled';
import { ViewPChainButton } from './ViewPChainButton';
import { WalletIcon } from './WalletIcon';

interface WalletCardProps {
  wallet: WalletDetails;
}

const WalletCard: FC<WalletCardProps> = ({ wallet }) => {
  const { t } = useTranslation();
  const { accounts, selectAccount, isActiveAccount } = useAccountsContext();
  const {
    isLoading,
    hasErrorOccurred,
    totalBalanceInCurrency,
    hasBalanceOnUnderivedAccounts,
  } = useWalletTotalBalance(wallet.id);
  const { currencyFormatter } = useSettingsContext();

  const hasActiveAccount = Boolean(
    accounts.primary[wallet.id]?.some(
      (account) => account.id === accounts.active?.id,
    ),
  );

  const [isExpanded, setIsExpanded] = useState(hasActiveAccount);

  return (
    <Styled.Accordion
      expanded={isExpanded}
      onChange={(_, expanded) => setIsExpanded(expanded)}
    >
      <Styled.NarrowSummary
        icon={<WalletIcon wallet={wallet} expanded={isExpanded} />}
      >
        <Stack
          direction="row"
          height="21px"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="titleBold">{wallet.name}</Typography>
          {isLoading && <CircularProgress size={21} />}
          {!isLoading && !hasErrorOccurred && (
            <Typography variant="title" color="text.disabled">
              {currencyFormatter(totalBalanceInCurrency ?? 0)}
            </Typography>
          )}
          {!isLoading && hasErrorOccurred && (
            <Typography variant="title" color="error">
              <MdErrorOutline size={21} />
              {t('Unable to load balances')}
            </Typography>
          )}
        </Stack>
      </Styled.NarrowSummary>
      <AccordionDetails>
        {accounts.primary[wallet.id]?.map((account) => (
          <AccountListItem
            key={account.id}
            account={account}
            selected={isActiveAccount(account.id)}
            onSelect={selectAccount}
          />
        ))}
      </AccordionDetails>
      {hasBalanceOnUnderivedAccounts && <ViewPChainButton />}
    </Styled.Accordion>
  );
};

export default WalletCard;
