import { FC } from 'react';
import {
  Avatar,
  AvatarProps,
  Stack,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { TokenApproval, TokenType } from '@avalabs/vm-module-types';

import { useSettingsContext } from '@core/ui';

import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';

import { ApprovalValue } from '../types';
import { InfinitySymbol } from './InfinitySymbol';
import { TxDetailsRow } from '../../../generic/DetailsItem/items/DetailRow';

type TokenSpendLimitCardProps = {
  approval: TokenApproval;
  approvalValue: ApprovalValue;
};

export const TokenSpendLimitCard: FC<TokenSpendLimitCardProps> = ({
  approval,
  approvalValue,
}) => {
  return approval.token.type !== TokenType.ERC20 ? (
    <NFTApprovalHeader approval={approval} approvalValue={approvalValue} />
  ) : (
    <ERC20ApprovalHeader approval={approval} approvalValue={approvalValue} />
  );
};

const NFTApprovalHeader = ({
  approval,
  approvalValue,
}: {
  approval: TokenApproval;
  approvalValue: ApprovalValue;
}) => {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();

  const { isUnlimited, tokenValue, currencyValue } = approvalValue;
  const { logoUri } = approval;

  if (!isUnlimited) {
    return (
      <TxDetailsRow label={t('Spend limit')}>
        <Stack role="button" direction="row" alignItems="center" gap={0.5}>
          <Stack
            direction="row"
            alignItems="center"
            gap={0.75}
            justifyContent="flex-end"
          >
            <CollapsedTokenAmount
              amount={tokenValue.toString()}
              regularProps={{ variant: 'body3' }}
              overlineProps={{ variant: 'caption2' }}
            />
            <Typography variant="body3" color="text.secondary">
              {approval.token.symbol}
            </Typography>
          </Stack>
          {currencyValue && (
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="end"
            >
              {currencyFormatter(Number(currencyValue || '0'))}
            </Typography>
          )}
        </Stack>
      </TxDetailsRow>
    );
  }

  return (
    <Stack
      width="100%"
      gap={1}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <SizedAvatar src={logoUri} alt={approval.token.symbol} size={64} />
      <Typography variant="subtitle1">{approval.token.name}</Typography>
      <Typography variant="caption" color="text.secondary">
        {t('Approves all {{token}}', { token: approval.token.name || '' })}
      </Typography>
    </Stack>
  );
};

const ERC20ApprovalHeader = ({
  approval,
  approvalValue,
}: {
  approval: TokenApproval;
  approvalValue: ApprovalValue;
}) => {
  const { t } = useTranslation();
  const { currencyFormatter, currency } = useSettingsContext();

  const { tokenValue, isUnlimited, currencyValue } = approvalValue;

  return (
    <Stack width="100%" textAlign="center">
      <Stack
        direction="row"
        alignItems="start"
        justifyContent="center"
        textAlign="center"
      >
        {isUnlimited ? (
          <InfinitySymbol symbolSize="large" />
        ) : (
          <CollapsedTokenAmount amount={tokenValue.toString()} />
        )}
        <Typography variant="subtitle1">{approval.token.symbol}</Typography>
      </Stack>
      {isUnlimited ? (
        <Typography variant="caption" color="text.secondary">
          {t('Unlimited {{currency}}', { currency })}
        </Typography>
      ) : (
        currencyValue && (
          <Typography variant="caption" color="text.secondary">
            {currencyFormatter(Number(currencyValue || '0'))}
          </Typography>
        )
      )}
    </Stack>
  );
};

type SizedAvatarProps = AvatarProps & {
  size: number;
};
const SizedAvatar = styled(Avatar)<SizedAvatarProps>(({ size }) => ({
  width: size,
  height: size,
  backgroundColor: 'transparent',
}));
