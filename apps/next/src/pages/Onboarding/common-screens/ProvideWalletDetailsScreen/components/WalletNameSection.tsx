import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, StackProps } from '@avalabs/k2-alpine';

import { useOnboardingContext } from '@core/ui';

import {
  Section,
  SectionLabel,
  SectionRow,
} from '@/pages/Onboarding/components/Section';
import { BorderlessTextField } from '@/components/BorderlessTextField';

export const WalletNameSection: FC<StackProps> = (props) => {
  const { t } = useTranslation();
  const { walletName, setWalletName } = useOnboardingContext();

  return (
    <Section {...props}>
      <SectionRow component="label">
        <SectionLabel>{t('Wallet name')}</SectionLabel>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <BorderlessTextField
            autoFocus
            size="small"
            placeholder="Wallet 1"
            value={walletName ?? ''}
            onChange={(e) => setWalletName(e.target.value)}
            slotProps={{
              htmlInput: {
                sx: { textAlign: 'end', px: 0, py: 0 },
                'data-testid': 'wallet-name-input',
              },
            }}
            fullWidth
          />
        </Stack>
      </SectionRow>
    </Section>
  );
};
