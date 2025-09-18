import { toast } from '@avalabs/k2-alpine';
import { DisplayData, RpcMethod } from '@avalabs/vm-module-types';
import { caipToChainId } from '@core/common';
import { Action, GaslessPhase } from '@core/types';
import { useAnalyticsContext, useNetworkFeeContext } from '@core/ui';
import { isUndefined } from 'lodash';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GaslessEligibilityParams, UseGasless } from './types';

export const useGasless: UseGasless = ({ action }) => {
  const { t } = useTranslation();
  const {
    isGaslessOn,
    setIsGaslessOn,
    gaslessFundTx,
    fundTxHex,
    setGaslessDefaultValues,
    gaslessPhase,
    setGaslessEligibility,
    fetchAndSolveGaslessChallange,
    isGaslessEligible,
  } = useNetworkFeeContext();
  const { captureEncrypted } = useAnalyticsContext();

  const eligibilityParams = useMemo(
    () => (action ? getEligibilityParams(action) : null),
    [action],
  );

  // First check if the action is elligible for gasless
  useEffect(() => {
    if (eligibilityParams) {
      setGaslessEligibility(...eligibilityParams);
    }
  }, [eligibilityParams, setGaslessEligibility]);

  // If we're eligible, fetch the gasless challenge
  useEffect(() => {
    if (isGaslessEligible && gaslessPhase === GaslessPhase.NOT_READY) {
      fetchAndSolveGaslessChallange();
    }
  }, [isGaslessEligible, fetchAndSolveGaslessChallange, gaslessPhase]);

  // Capture analytics events
  useEffect(() => {
    if (gaslessPhase === GaslessPhase.ERROR) {
      captureEncrypted('GaslessFundFailed');
    }
    if (gaslessPhase === GaslessPhase.FUNDED && fundTxHex) {
      captureEncrypted('GaslessFundSuccessful', {
        fundTxHex,
      });
    }
  }, [captureEncrypted, fundTxHex, gaslessPhase, setGaslessDefaultValues]);

  // Wrapper around the approval screen's approve callback so we don't pollute it with gasless funding logic
  const tryFunding = useCallback(
    async (approveCallback: () => void) => {
      if (isGaslessOn && isGaslessEligible) {
        try {
          await gaslessFundTx(action?.signingData);
        } catch {
          toast.error(t('Gasless funding failed'));
          // Do not auto-submit if user wanted to fund the transaction, but it failed
          return;
        }
      }
      // Submit the transaction
      approveCallback();
      // Clear the gasless state
      setGaslessDefaultValues();
    },
    [
      isGaslessOn,
      isGaslessEligible,
      gaslessFundTx,
      action?.signingData,
      t,
      setGaslessDefaultValues,
    ],
  );

  return {
    isGaslessOn,
    setIsGaslessOn,
    gaslessFundTx,
    fundTxHex,
    setGaslessDefaultValues,
    gaslessPhase,
    setGaslessEligibility,
    fetchAndSolveGaslessChallange,
    isGaslessEligible,
    tryFunding,
  };
};

const getEligibilityParams = (
  action: Action<DisplayData>,
): GaslessEligibilityParams | null => {
  if (
    !action ||
    !action.scope ||
    !action.scope.startsWith('eip155:') ||
    !action.signingData
  ) {
    return null;
  }

  const { signingData } = action;
  const evmChainId = caipToChainId(action.scope);

  if (signingData?.type === RpcMethod.ETH_SEND_TRANSACTION) {
    const fromAddress = isUndefined(signingData?.data.from)
      ? undefined
      : String(signingData?.data.from);
    const nonce = isUndefined(signingData?.data.nonce)
      ? undefined
      : Number(signingData?.data.nonce);

    return [evmChainId, fromAddress, nonce];
  }

  return [evmChainId, undefined, undefined];
};
