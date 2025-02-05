import type { UserExportInitResponse } from '@cubist-labs/cubesigner-sdk';
import { useCallback, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

import { isProductionBuild } from '@src/utils/environment';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { InitRecoveryPhraseExportHandler } from '@src/background/services/seedless/handlers/initRecoveryPhraseExport';
import type { CompleteRecoveryPhraseExportHandler } from '@src/background/services/seedless/handlers/completeRecoveryPhraseExport';
import type { GetRecoveryPhraseExportStateHandler } from '@src/background/services/seedless/handlers/getRecoveryPhraseExportState';
import type { CancelRecoveryPhraseExportHandler } from '@src/background/services/seedless/handlers/cancelRecoveryPhraseExport';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { SeedlessExportAnalytics } from '@src/background/services/seedless/seedlessAnalytics';

export enum ExportState {
  Loading,
  NotInitiated,
  Initiating,
  Pending,
  ReadyToExport,
  Exporting,
  Exported,
  Error,
  Cancelling,
}

export enum ExportErrorCode {
  FailedToInitialize,
  FailedToComplete,
  FailedToCancel,
  RequestOutdated,
}

// TODO: can we somehow fetch the delay from Cubist?
const HOURS_48 = 60 * 60 * 48;
const ONE_MINUTE = 60;
const EXPORT_DELAY = isProductionBuild() ? HOURS_48 : ONE_MINUTE;

export const useSeedlessMnemonicExport = () => {
  const { request } = useConnectionContext();
  const { capture } = useAnalyticsContext();

  const [pendingRequest, setPendingRequest] =
    useState<UserExportInitResponse>();
  const [mnemonic, setMnemonic] = useState('');
  const [state, setState] = useState<ExportState>(ExportState.Loading);
  const [error, setError] = useState<ExportErrorCode>();
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  const completeExport = useCallback(async () => {
    setState(ExportState.Exporting);
    setMnemonic('');
    capture(SeedlessExportAnalytics.DecryptionStarted);

    return request<CompleteRecoveryPhraseExportHandler>({
      method: ExtensionRequest.SEEDLESS_COMPLETE_RECOVERY_PHRASE_EXPORT,
    })
      .then((phrase) => {
        setMnemonic(phrase);
        setState(ExportState.Exported);
        capture(SeedlessExportAnalytics.DecryptionSucceeded);
      })
      .catch(() => {
        setState(ExportState.Error);
        setError(ExportErrorCode.FailedToComplete);
        capture(SeedlessExportAnalytics.DecryptionFailed);
      });
  }, [request, capture]);

  const cancelExport = useCallback(async () => {
    setState(ExportState.Cancelling);
    capture(SeedlessExportAnalytics.CancellationStarted);

    return request<CancelRecoveryPhraseExportHandler>({
      method: ExtensionRequest.SEEDLESS_CANCEL_RECOVERY_PHRASE_EXPORT,
    })
      .then(() => {
        setPendingRequest(undefined);
        setMnemonic('');
        setState(ExportState.NotInitiated);
        capture(SeedlessExportAnalytics.CancellationSucceeded);
      })
      .catch(() => {
        setState(ExportState.Error);
        setError(ExportErrorCode.FailedToCancel);
        capture(SeedlessExportAnalytics.CancellationFailed);
      });
  }, [request, capture]);

  const initExport = useCallback(async () => {
    setState(ExportState.Initiating);
    capture(SeedlessExportAnalytics.InitiationStarted);

    request<InitRecoveryPhraseExportHandler>({
      method: ExtensionRequest.SEEDLESS_INIT_RECOVERY_PHRASE_EXPORT,
    })
      .then((exportRequest) => {
        setPendingRequest(exportRequest);
        setState(ExportState.Pending);
        capture(SeedlessExportAnalytics.InitiationSucceeded);
      })
      .catch(() => {
        setState(ExportState.Error);
        setError(ExportErrorCode.FailedToInitialize);
        capture(SeedlessExportAnalytics.InitiationFailed);
      });
  }, [request, capture]);

  const updateProgress = useCallback(() => {
    if (!pendingRequest) {
      setState(ExportState.NotInitiated);
      return;
    }
    if (
      state === ExportState.ReadyToExport ||
      state === ExportState.Exporting ||
      state === ExportState.Exported
    ) {
      setProgress(100);
      return;
    }

    const { valid_epoch: availableAt, exp_epoch: availableUntil } =
      pendingRequest;

    const isInProgress = Date.now() / 1000 < availableAt;

    const isReadyToDecrypt =
      Date.now() / 1000 >= availableAt && Date.now() / 1000 <= availableUntil;

    const secondsPassed = EXPORT_DELAY - (availableAt - Date.now() / 1000);

    if (isInProgress) {
      setState(ExportState.Pending);
      setTimeLeft(formatDistanceToNow(new Date(availableAt * 1000)));
    } else if (isReadyToDecrypt) {
      setState(ExportState.ReadyToExport);
      setTimeLeft(formatDistanceToNow(new Date(availableUntil * 1000)));
    } else {
      setState(ExportState.Error);
      setError(ExportErrorCode.RequestOutdated);
    }

    // capped between 0 and 100
    setProgress(
      Math.min(Math.max(0, (secondsPassed / EXPORT_DELAY) * 100), 100),
    );
  }, [pendingRequest, state]);

  useEffect(() => {
    request<GetRecoveryPhraseExportStateHandler>({
      method: ExtensionRequest.SEEDLESS_GET_RECOVERY_PHRASE_EXPORT_STATE,
    }).then((existingExport) => {
      setState(existingExport ? ExportState.Pending : ExportState.NotInitiated);
      setPendingRequest(existingExport);
    });
  }, [request]);

  useEffect(() => {
    if (!pendingRequest) {
      return;
    }

    // Update progress immediately
    updateProgress();

    // Schedule updates every 2s
    if (state === ExportState.Pending) {
      const timer = setInterval(updateProgress, 2000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [pendingRequest, updateProgress, state]);

  return {
    state,
    initExport,
    completeExport,
    cancelExport,
    mnemonic,
    error,
    progress,
    timeLeft,
  };
};
