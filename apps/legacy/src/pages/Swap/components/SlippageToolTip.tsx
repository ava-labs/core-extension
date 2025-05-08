import { useTranslation } from 'react-i18next';
import { InfoCircleIcon, Tooltip } from '@avalabs/core-k2-components';

export function SlippageToolTip() {
  const { t } = useTranslation();

  return (
    <Tooltip
      title={t(
        'Suggested slippage – your transaction will fail if the price changes unfavorably more than this percentage',
      )}
    >
      <InfoCircleIcon size="14px" />
    </Tooltip>
  );
}
