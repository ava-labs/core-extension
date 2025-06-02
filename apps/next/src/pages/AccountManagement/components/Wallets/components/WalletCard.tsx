import {
  AccordionDetails,
  Stack,
  WalletOpenIcon,
  WalletClosedIcon,
} from '@avalabs/k2-alpine';
import AccountListItem from './AccountListItem';
import { WalletDetails } from '@core/types';
import { FC, useState } from 'react';
import {
  useAccountsContext,
  useBalanceTotalInCurrency,
  useSettingsContext,
} from '@core/ui';
import { Typography } from '../../Typography';
import * as Styled from './Styled';

interface WalletCardProps {
  wallet: WalletDetails;
}

const WalletCard: FC<WalletCardProps> = ({ wallet }) => {
  const { accounts, selectAccount, isActiveAccount } = useAccountsContext();
  const balance = useBalanceTotalInCurrency(accounts.active);
  const { currencyFormatter } = useSettingsContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const WalletIcon = isExpanded ? WalletOpenIcon : WalletClosedIcon;

  return (
    <Styled.Accordion
      expanded={isExpanded}
      onChange={(_, expanded) => setIsExpanded(expanded)}
    >
      <Styled.NarrowSummary icon={<WalletIcon size={21} />}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="titleBold">{wallet.name}</Typography>
          <Styled.FadedText variant="title">
            {currencyFormatter(balance?.sum ?? 0)}
          </Styled.FadedText>
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
    </Styled.Accordion>
  );
};

export default WalletCard;
