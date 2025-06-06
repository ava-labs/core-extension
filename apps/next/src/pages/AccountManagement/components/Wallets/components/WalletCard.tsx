import { AccordionDetails, CircularProgress, Stack } from '@avalabs/k2-alpine';
import { WalletDetails } from '@core/types';
import {
  useAccountsContext,
  useSettingsContext,
  useWalletTotalBalance,
} from '@core/ui';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/Typography';
import AccountListItem from './AccountListItem';
import * as Styled from './Styled';
import { ViewPChainButton } from './ViewPChainButton';
import { WalletIcon } from './WalletIcon';

interface WalletCardProps {
  wallet: WalletDetails;
}

const WalletCard: FC<WalletCardProps> = ({ wallet }) => {
  const { t } = useTranslation();
  const detailsRef = useRef<HTMLDivElement>(null);
  const { accounts, selectAccount, isActiveAccount } = useAccountsContext();
  const {
    isLoading,
    hasErrorOccurred,
    totalBalanceInCurrency,
    hasBalanceOnUnderivedAccounts,
  } = useWalletTotalBalance(wallet.id);
  const { currencyFormatter } = useSettingsContext();

  const hasActiveAccount = Boolean(
    accounts.primary[wallet.id]?.some(({ id }) => isActiveAccount(id)),
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
          gap={0.5}
          width="calc(100% - 8px)"
        >
          <Typography
            variant="titleBold"
            marginInlineEnd="auto"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {wallet.name}
          </Typography>
          {isLoading && <CircularProgress size={14} />}
          {!isLoading && !hasErrorOccurred && (
            <Typography variant="title" color="text.disabled">
              {currencyFormatter(totalBalanceInCurrency ?? 0)}
            </Typography>
          )}
          {!isLoading && hasErrorOccurred && (
            <>
              <Styled.ErrorIcon size={16} />
              <Typography
                variant="title"
                color="error"
                component="span"
                whiteSpace="nowrap"
              >
                {t('Unable to load balances')}
              </Typography>
            </>
          )}
        </Stack>
      </Styled.NarrowSummary>
      <AccordionDetails
        ref={detailsRef}
        sx={{
          paddingInline: 1.5,
        }}
      >
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
