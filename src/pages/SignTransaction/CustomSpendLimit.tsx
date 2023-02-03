import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import BN from 'bn.js';
import { useState } from 'react';
import { DomainMetadata } from '@src/background/models';
import { PageTitle } from '@src/components/common/PageTitle';
import { TokenWithBalanceERC20 } from '@src/background/services/balances/models';
import { Trans, useTranslation } from 'react-i18next';
import { BNInput } from '@avalabs/react-components';

export enum Limit {
  DEFAULT = 'DEFAULT',
  UNLIMITED = 'UNLIMITED',
  CUSTOM = 'CUSTOM',
}

export interface SpendLimit {
  limitType: Limit;
  value?: {
    bn: any;
    amount: string;
  };
}

const SpendLimitOption = ({ label, value, checked, ...props }) => (
  <FormControlLabel
    label={label}
    value={value}
    control={<Radio size="medium" color={checked ? 'secondary' : 'primary'} />}
    sx={{
      '.MuiFormControlLabel-label': {
        fontSize: 'body2.fontSize',
        fontWeight: checked ? 'fontWeightSemibold' : 'fontWeightRegular',
      },
    }}
    {...props}
  />
);

export function CustomSpendLimit({
  spendLimit,
  token,
  onClose,
  setSpendLimit,
  requestedApprovalLimit,
  site,
}: {
  token: TokenWithBalanceERC20;
  setSpendLimit(limitData: SpendLimit): void;
  onClose(): void;
  spendLimit: SpendLimit;
  site: DomainMetadata;
  requestedApprovalLimit?: BN;
}) {
  const { t } = useTranslation();
  const [customSpendLimit, setCustomSpendLimit] = useState<SpendLimit>({
    ...spendLimit,
  });

  const handleOnSave = () => {
    setSpendLimit(customSpendLimit);
    onClose();
  };

  return (
    <Stack sx={{ width: '100%', gap: 3 }}>
      <PageTitle onBackClick={() => onClose()} margin="0">
        {t('Edit Spending Limit')}
      </PageTitle>

      <Stack sx={{ px: 2, gap: 3 }}>
        <Stack sx={{ gap: 1.5 }}>
          <Typography
            sx={{
              fontSize: 'body2.fontSize',
              fontWeight: 'fontWeightSemibold',
            }}
          >
            {t('Spending limit')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <Trans
              i18nKey="Set a limit that you will allow {{site.domain}} to automatically spend."
              values={{ site }}
            />
          </Typography>
        </Stack>
        <RadioGroup
          sx={{ gap: 2 }}
          onChange={(ev, limitType) => {
            setCustomSpendLimit({
              ...customSpendLimit,
              limitType: limitType as Limit,
            });
          }}
          value={customSpendLimit.limitType}
        >
          <SpendLimitOption
            label={t('Unlimited')}
            value={Limit.UNLIMITED}
            checked={customSpendLimit.limitType === Limit.UNLIMITED}
          />
          <Stack sx={{ gap: 1.5 }}>
            <SpendLimitOption
              label={t('Default')}
              value={Limit.DEFAULT}
              checked={customSpendLimit.limitType === Limit.DEFAULT}
            />
            <Box sx={{ pl: 3 }}>
              <BNInput
                disabled
                value={requestedApprovalLimit}
                denomination={token.decimals}
                width="100%"
              />
            </Box>
          </Stack>
          <Stack sx={{ gap: 1.5 }}>
            <SpendLimitOption
              label={t('Custom Spend Limit')}
              value={Limit.CUSTOM}
              checked={customSpendLimit.limitType === Limit.CUSTOM}
            />
            <Box sx={{ pl: 3 }}>
              <BNInput
                onChange={(value) => {
                  setCustomSpendLimit({
                    ...customSpendLimit,
                    value,
                    limitType: Limit.CUSTOM,
                  });
                }}
                denomination={token.decimals}
                placeholder={t('Maximum Limit')}
                value={customSpendLimit.value?.bn} // TODO: properly handle zero (BNInput sees zero as an empty value)
                width="100%"
              />
            </Box>
          </Stack>
        </RadioGroup>
      </Stack>
      <Stack
        sx={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'flex-end',
          width: '100%',
          pt: 0,
          px: 2,
          pb: 1,
        }}
      >
        <Button
          color="primary"
          size="large"
          onClick={handleOnSave}
          sx={{ fontSize: 'body2.fontSize' }}
          fullWidth
        >
          {t('Save')}
        </Button>
      </Stack>
    </Stack>
  );
}
