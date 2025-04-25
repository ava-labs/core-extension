import {
  Button,
  ButtonProps,
  ChevronDownIcon,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';

import { useAccountsContext } from '@/contexts/AccountsProvider';
import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

export function AccountSelectorButton(props: ButtonProps) {
  const history = useHistory();
  const { capture } = useAnalyticsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const [isOverflowing, setIsOverflowing] = useState(false);

  const onRefChange = useCallback((node: HTMLSpanElement) => {
    if (node) {
      setIsOverflowing(node.scrollWidth > node.offsetWidth);
    }
  }, []);

  return (
    <Button
      size="xlarge"
      color="primary"
      variant="text"
      data-testid="account-selector-button"
      onClick={() => {
        history.push('/accounts');
        capture('AccountSelectorOpened');
      }}
      endIcon={<ChevronDownIcon />}
      sx={{ p: 0, maxWidth: 200 }}
      {...props}
    >
      <Tooltip
        title={isOverflowing ? activeAccount?.name : ''}
        wrapWithSpan={false}
      >
        <Typography
          component="span"
          variant="h6"
          sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
          ref={onRefChange}
        >
          {activeAccount?.name}
        </Typography>
      </Tooltip>
    </Button>
  );
}
