import { Tooltip } from '@avalabs/k2-alpine';
import { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  children: ReactElement;
};

export const LedgerTooltip: FC<Props> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      title={t(
        'Connect your Ledger device and open the Avalanche app to add an account.',
      )}
    >
      {children}
    </Tooltip>
  );
};
