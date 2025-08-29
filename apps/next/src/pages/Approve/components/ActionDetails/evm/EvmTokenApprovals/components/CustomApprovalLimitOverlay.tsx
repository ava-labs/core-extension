import { Radio } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { Dispatch, FC, SetStateAction } from 'react';
import { TokenApproval, TokenType } from '@avalabs/vm-module-types';
import { Button, Stack, Typography } from '@avalabs/k2-alpine';
import { MaxUint256, parseUnits, formatUnits } from 'ethers';

import { useKeyboardShortcuts } from '@core/ui';

import { Page } from '@/components/Page';
import { SlideUpDialog } from '@/components/Dialog';

import { DetailsSection } from '../../../generic/DetailsSection';
import { ApprovalValue, SpendLimit } from '../types';
import { InfinitySymbol } from './InfinitySymbol';
import { AmountInput } from './AmountInput';

type CustomApprovalLimitOverlayProps = {
  isDialogOpen: boolean;
  onClose: () => void;
  spendLimit: SpendLimit;
  setSpendLimit: Dispatch<SetStateAction<SpendLimit>>;
  approval: TokenApproval;
  isUnlimitedRequested: boolean;
  requestedValue: ApprovalValue;
  onSave: () => void;
};

export const CustomApprovalLimitOverlay: FC<
  CustomApprovalLimitOverlayProps
> = ({
  isDialogOpen,
  onClose,
  spendLimit,
  setSpendLimit,
  approval,
  isUnlimitedRequested,
  requestedValue,
  onSave,
}) => {
  const { t } = useTranslation();

  const handleSave = () => {
    onSave();
  };

  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: handleSave,
  });

  return (
    <SlideUpDialog open={isDialogOpen} onClose={onClose}>
      <Page
        withBackButton
        withViewSwitcher={false}
        onBack={onClose}
        title={t('Edit spend limit')}
        description={t(
          'Set a limit that you will allow to automatically spend.',
        )}
        {...keyboardShortcuts}
      >
        <DetailsSection>
          <Stack
            direction="row"
            gap={1}
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            pr={2.5}
            pl={0.5}
            component="label"
          >
            <Stack direction="row" gap={1} alignItems="center">
              <Radio
                checked={spendLimit.type === 'unlimited'}
                onChange={() =>
                  setSpendLimit({
                    type: 'unlimited',
                    value: MaxUint256,
                  })
                }
              />
              <Typography variant="body3">{t('Unlimited')}</Typography>
            </Stack>
            <InfinitySymbol symbolSize="small" color="text.secondary" />
          </Stack>
          {!isUnlimitedRequested && (
            <Stack
              direction="row"
              gap={1}
              width="100%"
              alignItems="center"
              justifyContent="space-between"
              pr={2.5}
              pl={0.5}
              component="label"
            >
              <Stack direction="row" gap={1} alignItems="center">
                <Radio
                  checked={spendLimit.type === 'requested'}
                  onChange={() =>
                    setSpendLimit({
                      type: 'requested',
                      value: requestedValue.tokenValue.toSubUnit(),
                    })
                  }
                />
                <Typography variant="body3">{t('Default')}</Typography>
              </Stack>
              <Typography variant="body3" color="text.secondary">
                {requestedValue.tokenValue.toDisplay()} {approval.token.symbol}
              </Typography>
            </Stack>
          )}
          <Stack
            direction="row"
            gap={1}
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            pr={2.5}
            pl={0.5}
            component="label"
          >
            <Stack direction="row" gap={1} alignItems="center">
              <Radio
                checked={spendLimit.type === 'custom'}
                onChange={() =>
                  setSpendLimit((prev) => ({
                    type: 'custom',
                    value: prev.type !== 'unlimited' ? prev.value : 0n,
                  }))
                }
              />
              <Typography variant="body3">{t('Custom')}</Typography>
            </Stack>
            <AmountInput
              onFocus={(evt) => {
                setSpendLimit({
                  type: 'custom',
                  value: parseUnits(
                    evt.currentTarget.value || '0',
                    approval.token.type === TokenType.ERC20
                      ? approval.token.decimals
                      : 1,
                  ),
                });
              }}
              defaultValue={
                spendLimit.type === 'unlimited'
                  ? '0'
                  : formatUnits(
                      spendLimit.value ?? 0n,
                      approval.token.type === TokenType.ERC20
                        ? approval.token.decimals
                        : 1,
                    )
              }
              onChange={(evt) => {
                setSpendLimit({
                  type: 'custom',
                  value: parseUnits(
                    evt.currentTarget.value || '0',
                    approval.token.type === TokenType.ERC20
                      ? approval.token.decimals
                      : 1,
                  ),
                });
              }}
            />
          </Stack>
        </DetailsSection>

        <Stack width="100%" flexGrow={1} justifyContent="flex-end" gap={1}>
          <Button
            variant="contained"
            color="primary"
            size="extension"
            fullWidth
            onClick={handleSave}
          >
            {t('Save')}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="extension"
            fullWidth
            onClick={onClose}
          >
            {t('Cancel')}
          </Button>
        </Stack>
      </Page>
    </SlideUpDialog>
  );
};
