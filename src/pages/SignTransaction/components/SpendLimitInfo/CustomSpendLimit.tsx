import browser from 'webextension-polyfill';
import { useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { Trans, useTranslation } from 'react-i18next';

import { BNInput } from '@src/components/common/BNInput';
import { PageTitle } from '@src/components/common/PageTitle';
import type { DomainMetadata } from '@src/background/models';
import type { SpendLimit } from './TokenSpendLimit';
import { Limit } from './TokenSpendLimit';
import type { ERC20Token } from '@avalabs/vm-module-types';

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
  token: ERC20Token;
  setSpendLimit(limitData: SpendLimit): void;
  onClose(): void;
  spendLimit: SpendLimit;
  site?: DomainMetadata;
  requestedApprovalLimit?: bigint;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [customSpendLimit, setCustomSpendLimit] = useState<SpendLimit>({
    ...spendLimit,
  });

  const handleOnSave = () => {
    setSpendLimit(customSpendLimit);
    onClose();
  };

  const isFromExtension = site?.domain === browser.runtime.id;
  const appName =
    (isFromExtension
      ? browser.runtime.getManifest().short_name
      : site?.domain) ?? t('Unknown Site');

  return (
    <Stack sx={{ width: '100%', gap: 3 }}>
      <PageTitle onBackClick={() => onClose()} margin="0">
        {t('Edit Spending Limit')}
      </PageTitle>

      <Stack sx={{ px: 2, gap: 3 }}>
        <Stack sx={{ gap: 1.5, maxWidth: 1 }}>
          <Typography
            sx={{
              fontSize: 'body2.fontSize',
              fontWeight: 'fontWeightSemibold',
            }}
          >
            {t('Spending limit')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              maxWidth: 1,
              wordWrap: 'break-word',
              color: 'text.secondary',
            }}
          >
            <Trans
              i18nKey="Set a limit that you will allow <b>{{domain}}</b> to automatically spend."
              values={{ domain: appName }}
              components={{
                b: <b style={{ color: theme.palette.text.primary }} />,
              }}
            />
          </Typography>
        </Stack>
        <RadioGroup
          sx={{ gap: 2 }}
          onChange={(_ev, limitType) => {
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
                withMaxButton={false}
                value={requestedApprovalLimit ?? 0n}
                denomination={token.decimals}
                fullWidth
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
                withMaxButton={false}
                onChange={(value) => {
                  setCustomSpendLimit({
                    ...customSpendLimit,
                    value: value.bigint,
                    limitType: Limit.CUSTOM,
                  });
                }}
                denomination={token.decimals}
                placeholder={t('Maximum Limit')}
                value={customSpendLimit.value ?? 0n} // TODO: properly handle zero (BNInput sees zero as an empty value)
                fullWidth
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
        <Button color="primary" size="large" onClick={handleOnSave} fullWidth>
          {t('Save')}
        </Button>
      </Stack>
    </Stack>
  );
}
