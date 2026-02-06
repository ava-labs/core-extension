import { Button } from '@avalabs/k2-alpine';
import { useOnline } from '@core/ui';
import { OfflineTooltip } from './OfflineTooltip';

type Props = {
  isLoading?: boolean;
  onClick: () => void;
  isDisabled?: boolean;
  title: string;
};

/**
 * @description The TxButton component is a wrapper around the Button component that checks the online state and adds a tooltip for the offline state.
 */

export const TxButton = ({
  isLoading,
  onClick,
  isDisabled: isDisabledParam = false,
  title,
}: Props) => {
  const { isOnline } = useOnline();
  const isDisabled = isDisabledParam || !isOnline;
  return (
    <OfflineTooltip>
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
    </OfflineTooltip>
  );
};
