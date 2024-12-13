import {
  Box,
  Grow,
  IconButton,
  PencilRoundIcon,
  Stack,
} from '@avalabs/core-k2-components';

import { useAccountManager } from '../providers/AccountManagerProvider';
import { OverflowingTypography } from './OverflowingTypography';

interface AccountNameProps {
  accountName: string;
  cardHovered: boolean;
  promptRename(): void;
  isActive?: boolean;
}

const commonTransitionProps = {
  timeout: 200,
  easing: 'ease-in-out',
  appear: true,
};

export default function AccountName({
  accountName,
  cardHovered,
  isActive,
  promptRename,
}: AccountNameProps) {
  const { isManageMode } = useAccountManager();

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          width: isActive ? 6 : 0,
          height: isActive ? 6 : 0,
          marginRight: isActive ? 0.5 : 0,
          borderRadius: 1,
          position: 'relative',
          backgroundColor: 'success.main',
          transitionDuration: '200ms',
          transitionTimingFunction: 'ease-in-out',
          transitionProperty: 'width, height, margin-right',
        }}
      />
      <OverflowingTypography
        data-testid="account-name"
        variant="caption"
        fontWeight={600}
        lineHeight="16px"
        sx={{ mr: 1 }}
      >
        {accountName}
      </OverflowingTypography>
      <Grow {...commonTransitionProps} in={cardHovered && !isManageMode}>
        <IconButton
          size="small"
          sx={{ p: 0.25 }}
          onClick={(e) => {
            e.stopPropagation();
            promptRename();
          }}
        >
          <PencilRoundIcon size={16} />
        </IconButton>
      </Grow>
    </Stack>
  );
}
