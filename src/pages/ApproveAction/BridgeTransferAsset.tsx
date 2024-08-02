import { Action, ActionStatus } from '@src/background/services/actions/models';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Typography, Divider } from '@avalabs/core-k2-components';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';
import { NetworkLogo } from '@src/components/common/NetworkLogo';
import { TokenAmount } from '@src/components/common/TokenAmount';
import Big from 'big.js';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { CustomFees, GasFeeModifier } from '@src/components/common/CustomFees';
import {
  BridgeActionDisplayData,
  CustomGasSettings,
} from '@src/background/services/bridge/models';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { getTokenPrice } from '@src/background/services/balances/models';

export function BridgeTransferAsset({
  action,
}: {
  action: Action<BridgeActionDisplayData>;
}) {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const { capture } = useAnalyticsContext();
  const { network } = useNetworkContext();
  const { networkFee } = useNetworkFeeContext();
  const requestId = useGetRequestId();
  const { updateAction } = useApproveAction(requestId);
  const { displayData } = action;
  const [gasSettings, setGasSettings] = useState<CustomGasSettings>({});
  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.INSTANT
  );

  const tokenPrice = getTokenPrice(displayData.token);
  const fiatValue: Big | undefined =
    typeof tokenPrice === 'number'
      ? new Big(displayData.amountStr).times(tokenPrice)
      : undefined;

  const onGasSettingsChanged = useCallback(
    (newSettings: CustomGasSettings) => {
      setGasSettings((currSettings) => {
        const hasNewMaxFee =
          typeof newSettings.maxFeePerGas !== 'undefined' &&
          newSettings.maxFeePerGas !== currSettings.maxFeePerGas;

        const hasNewMaxTip =
          typeof newSettings.maxPriorityFeePerGas !== 'undefined' &&
          newSettings.maxPriorityFeePerGas !==
            currSettings.maxPriorityFeePerGas;

        if (hasNewMaxFee || hasNewMaxTip) {
          updateAction({
            id: action.actionId,
            status: ActionStatus.PENDING,
            displayData: {
              gasSettings: newSettings,
            },
          });

          return {
            ...currSettings,
            ...newSettings,
          };
        }

        return currSettings;
      });
    },
    [setGasSettings, action.actionId, updateAction]
  );

  return (
    <Stack sx={{ flexGrow: 1, width: 1 }}>
      <Typography variant="h4" sx={{ mt: 1.5, mb: 3.5 }}>
        {t('Bridge Approval')}
      </Typography>
      <ApprovalSection>
        <ApprovalSectionHeader
          label={t('Transaction Details')}
        ></ApprovalSectionHeader>
        <ApprovalSectionBody sx={{ py: 1, px: 2, gap: 1 }}>
          <TxDetailsRow label={t('App')}>
            <Typography
              variant="caption"
              sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
            >
              {action.site?.domain ?? ''}
            </Typography>
          </TxDetailsRow>
          <TxDetailsRow label={t('From')}>
            <Typography variant="caption">
              {displayData.sourceNetwork?.chainName}
            </Typography>
            <NetworkLogo
              src={displayData.sourceNetwork?.logoUri}
              width="16px"
              height="16px"
              defaultSize={16}
            />
          </TxDetailsRow>
          <TxDetailsRow label={t('To')}>
            <Typography variant="caption">
              {displayData.targetNetwork?.chainName}
            </Typography>
            <NetworkLogo
              src={displayData.targetNetwork?.logoUri}
              width="16px"
              height="16px"
              defaultSize={16}
            />
          </TxDetailsRow>
        </ApprovalSectionBody>
      </ApprovalSection>
      <ApprovalSection sx={{ my: 2 }}>
        <ApprovalSectionHeader
          label={t('Balance Change')}
        ></ApprovalSectionHeader>
        <ApprovalSectionBody sx={{ p: 2 }}>
          <TxDetailsRow label={t('Transaction Type')}>
            <Typography variant="caption">{t('Bridge')}</Typography>
          </TxDetailsRow>
          <Divider sx={{ mb: 1 }} />
          <TokenAmount
            token={displayData.token}
            amount={displayData.amountStr}
            fiatValue={fiatValue ? currencyFormatter(fiatValue.toNumber()) : ''}
          />
        </ApprovalSectionBody>
      </ApprovalSection>

      <CustomFees
        isLimitReadonly
        maxFeePerGas={gasSettings.maxFeePerGas || 0n}
        limit={Number(action.displayData.gasLimit) || 0}
        onChange={(settings) => {
          onGasSettingsChanged({
            maxFeePerGas: settings.maxFeePerGas,
            maxPriorityFeePerGas: settings.maxPriorityFeePerGas,
            // do not allow changing gasLimit via the UI
          });

          if (settings.feeType) {
            setSelectedGasFee(settings.feeType);
          }
        }}
        onModifierChangeCallback={(modifier: GasFeeModifier | undefined) => {
          if (modifier) {
            setSelectedGasFee(modifier);
          }
          capture('BridgeFeeOptionChanged', { modifier });
        }}
        selectedGasFeeModifier={selectedGasFee}
        network={network}
        networkFee={networkFee}
      />
    </Stack>
  );
}
