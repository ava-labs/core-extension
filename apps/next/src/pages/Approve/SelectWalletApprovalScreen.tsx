import { useCallback } from 'react';
import { Card, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { Trans, useTranslation } from 'react-i18next';

import { ActionStatus } from '@core/types';
import { useApproveAction, useGetRequestId } from '@core/ui';

import { NoScrollStack } from '@/components/NoScrollStack';
import { ActionDrawer, LoadingScreen, Styled } from './components';
import { SizedAvatar } from '@/components/SizedAvatar';
import CoreLogoLight from '@/images/wallet-selector-logos/core-logo-light.svg';
import CoreLogoDark from '@/images/wallet-selector-logos/core-logo-dark.svg';
import { WalletSelectorRow } from './components/WalletSelectorRow';
export const SelectWalletApprovalScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const requestId = useGetRequestId();
  const { action, updateAction, cancelHandler } = useApproveAction(requestId);

  const approve = useCallback(
    async (index: number) => {
      updateAction({
        status: ActionStatus.SUBMITTING,
        id: requestId,
        result: index,
      });
    },
    [updateAction, requestId],
  );

  if (!action) {
    return <LoadingScreen />;
  }

  const walletsWithoutCore = action.displayData.info
    .map((wallet, index) => ({ ...wallet, index }))
    .filter((wallet) => wallet.rdns !== 'app.core.extension');
  const coreLogo =
    theme.palette.mode === 'light' ? CoreLogoDark : CoreLogoLight;
  return (
    <Styled.ApprovalScreenPage>
      <NoScrollStack>
        <Stack px={2} flexGrow={1}>
          <Stack
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <Stack direction="row" alignItems="center">
              {walletsWithoutCore[1] && (
                <SizedAvatar
                  sx={{ borderRadius: '14px' }}
                  size={50}
                  src={walletsWithoutCore[1].icon}
                />
              )}
              <SizedAvatar
                sx={{ marginLeft: '-18px', borderRadius: '16px' }}
                size={56}
                src={walletsWithoutCore[0].icon}
              />
              <SizedAvatar
                sx={{ marginLeft: '-18px', borderRadius: '18px' }}
                size={62}
                src={coreLogo}
              />
            </Stack>

            <Typography variant="h2" textAlign="center">
              <Trans i18nKey="Which wallet would <br /> you like to use?" />
            </Typography>
            <Typography variant="body3" textAlign="center">
              <Trans i18nKey="It looks like multiple wallets are installed. <br /> Select which one you would like to <br/> connect to." />
            </Typography>
          </Stack>
          <Card sx={{ px: 2 }}>
            <WalletSelectorRow
              key={'core'}
              onClick={() => approve(0)}
              name={'Core'}
              icon={coreLogo}
            />
            {walletsWithoutCore.map((wallet, i) => (
              <WalletSelectorRow
                key={wallet.uuid}
                onClick={() => approve(wallet.index)}
                name={wallet.name}
                icon={wallet.icon}
                isLast={i === walletsWithoutCore.length - 1}
              />
            ))}
          </Card>
        </Stack>
      </NoScrollStack>
      <ActionDrawer
        open
        reject={cancelHandler}
        rejectText={t('Cancel')}
        isProcessing={action.status === ActionStatus.SUBMITTING}
      />
    </Styled.ApprovalScreenPage>
  );
};
