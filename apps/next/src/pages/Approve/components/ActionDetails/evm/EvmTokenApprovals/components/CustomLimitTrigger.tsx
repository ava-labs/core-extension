import {
  ChevronRightIcon,
  Stack,
  StackProps,
  Typography,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { TokenApproval } from '@avalabs/vm-module-types';

import { useSettingsContext } from '@core/ui';

import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';

import { ApprovalValue, SpendLimit } from '../types';
import { InfinitySymbol } from './InfinitySymbol';

type CustomLimitTriggerProps = StackProps & {
  spendLimit: SpendLimit;
  approval: TokenApproval;
  approvalValue: ApprovalValue;
};

export const CustomLimitTrigger = ({
  spendLimit,
  approval,
  approvalValue,
  ...props
}: CustomLimitTriggerProps) => {
  const { t } = useTranslation();
  const { currencyFormatter, currency } = useSettingsContext();

  const { tokenValue, currencyValue, isUnlimited } = approvalValue;

  return (
    <Stack
      role="button"
      direction="row"
      alignItems="center"
      gap={0.5}
      sx={{ cursor: 'pointer' }}
      {...props}
    >
      <Stack>
        <Stack
          direction="row"
          alignItems="center"
          gap={0.75}
          justifyContent="flex-end"
        >
          {spendLimit.type === 'unlimited' ? (
            <InfinitySymbol symbolSize="small" textAlign="end" />
          ) : (
            <CollapsedTokenAmount
              amount={tokenValue.toString()}
              regularProps={{ variant: 'body3' }}
              overlineProps={{ variant: 'caption2' }}
            />
          )}
          <Typography variant="body3" color="text.secondary">
            {approval.token.symbol}
          </Typography>
        </Stack>
        {isUnlimited ? (
          <Typography variant="caption" color="text.secondary">
            {t('Unlimited {{currency}}', {
              currency,
            })}
          </Typography>
        ) : (
          currencyValue && (
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="end"
            >
              {currencyFormatter(Number(currencyValue || '0'))}
            </Typography>
          )
        )}
      </Stack>
      <ChevronRightIcon size={16} opacity={0.3} />
    </Stack>
  );
};
