import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { toast } from '@avalabs/k2-components';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ImportSeedPhraseHandler } from '@src/background/services/wallet/handlers/importSeedPhrase';
import { ImportSeedphraseWalletParams } from '@src/background/services/wallet/handlers/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useErrorMessage } from '@src/hooks/useErrorMessage';

type ImportWalletFn = (params: ImportSeedphraseWalletParams) => Promise<void>;

export const useImportSeedphrase = () => {
  const { request } = useConnectionContext();
  const { t } = useTranslation();
  const history = useHistory();
  const [isImporting, setIsImporting] = useState(false);
  const { capture } = useAnalyticsContext();
  const getErrorMessage = useErrorMessage();

  const importSeedphrase: ImportWalletFn = useCallback(
    async (params) => {
      setIsImporting(true);

      try {
        capture('SeedphraseImportStarted');
        const result = await request<ImportSeedPhraseHandler>({
          method: ExtensionRequest.WALLET_IMPORT_SEED_PHRASE,
          params: [params],
        });

        toast.success(t('{{walletName}} Added', { walletName: result.name }));
        capture('SeedphraseImportSuccess');

        history.replace('/accounts');
      } catch (err) {
        capture('SeedphraseImportFailure');
        sentryCaptureException(
          err as Error,
          SentryExceptionTypes.WALLET_IMPORT
        );
        const { title } = getErrorMessage(err);
        toast.error(title);
      } finally {
        setIsImporting(false);
      }
    },
    [capture, history, request, t, getErrorMessage]
  );

  return {
    isImporting,
    importSeedphrase,
  };
};
