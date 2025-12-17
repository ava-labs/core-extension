import { useConfettiContext } from '@/components/Confetti';
import { ACCOUNT_MANAGEMENT_QUERY_TOKENS } from '@/config/routes';
import { toast } from '@avalabs/k2-alpine';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

export function useImportWalletSuccess() {
  const { t } = useTranslation();
  const { search } = useLocation();
  const history = useHistory();
  const { triggerConfetti } = useConfettiContext();

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const showImportSuccess = searchParams.get(
      ACCOUNT_MANAGEMENT_QUERY_TOKENS.showImportSuccess,
    );

    if (showImportSuccess) {
      toast.success(t('Wallet Imported'), { duration: 2000 });
      triggerConfetti();
      history.replace({ search: '' });
    }
  }, [t, search, history, triggerConfetti]);
}
