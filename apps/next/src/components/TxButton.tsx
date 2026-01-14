import { Button, Tooltip } from '@avalabs/k2-alpine';
import { useOnline } from '@core/ui';
import { useTranslation } from 'react-i18next';

/**
 * @description The TxButton component is a wrapper around the Button component that checks the online state and adds a tooltip for the offline state.
 */

export const TxButton = ({
  isLoading,
  onClick,
  isDisabled: isDisabledParam,
  title,
}: {
  isLoading?: boolean;
  onClick: () => void;
  isDisabled?: boolean;
  title: string;
}) => {
  const { t } = useTranslation();
  const { isOnline } = useOnline();
  const isDisabled = isDisabledParam || !isOnline;
  return (
    <Tooltip title={!isOnline ? t('You are offline') : ''}>
      <span>
        <Button
          variant="contained"
          color="primary"
          size="extension"
          fullWidth
          disabled={isDisabled}
          loading={isLoading}
          onClick={onClick}
        >
          {title}
        </Button>
      </span>
    </Tooltip>
  );
};
