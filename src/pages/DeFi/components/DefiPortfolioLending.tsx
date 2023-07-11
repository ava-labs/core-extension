import { useTranslation } from 'react-i18next';
import { Avatar, Stack, Typography } from '@avalabs/k2-components';

import {
  DefiLendingItem,
  DefiToken,
} from '@src/background/services/defi/models';

import { useConvertedCurrencyFormatter } from '../hooks/useConvertedCurrencyFormatter';

type Props = {
  items: DefiLendingItem[];
};

export const DefiPortfolioLending = ({ items }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack sx={{ gap: 3 }}>
      {items.map(({ supplyTokens, borrowTokens, rewardTokens }, index) => (
        <Stack key={`defi-lending-${index}`} sx={{ gap: 2 }}>
          {supplyTokens.length > 0 && (
            <DefiLendingSection
              tokens={supplyTokens}
              headers={[t('Supplied'), t('Value')]}
            />
          )}
          {borrowTokens.length > 0 && (
            <DefiLendingSection
              tokens={borrowTokens}
              headers={[t('Borrowed')]}
            />
          )}
          {rewardTokens.length > 0 && (
            <DefiLendingSection
              tokens={rewardTokens}
              headers={[t('Rewards')]}
            />
          )}
        </Stack>
      ))}
    </Stack>
  );
};

type SectionProps = {
  headers: string[];
  tokens: DefiToken[];
};

const DefiLendingSection = ({ headers, tokens }: SectionProps) => {
  const formatValue = useConvertedCurrencyFormatter();

  return (
    <Stack sx={{ gap: 1.25 }} data-testid="defi-lending-section">
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        {headers.map((header) => (
          <Typography key={header} variant="button">
            {header}
          </Typography>
        ))}
      </Stack>

      {tokens.map((token) => (
        <Stack
          key={token.symbol}
          direction="row"
          sx={{ gap: 1, justifyContent: 'space-between' }}
          data-testid="defi-item"
        >
          <Stack direction="row" sx={{ gap: 1 }}>
            <Avatar
              key={token.symbol}
              src={token.logoUrl}
              alt={token.name}
              sx={{ width: 16, height: 16 }}
              data-testid="defi-item-token-avatar"
            />
            <Typography variant="caption" data-testid="defi-item-token-list">
              {token.symbol}
            </Typography>
          </Stack>
          <Typography variant="caption" data-testid="defi-item-value">
            {formatValue(token.usdValue)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
