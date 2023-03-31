import React from 'react';
import { truncateAddress } from '@src/utils/truncateAddress';

import {
  styled,
  Typography,
  Stack,
  toast,
  CopyIcon,
  TypographyProps,
  IconBaseProps,
} from '@avalabs/k2-components';

export interface SimpleAddressProps {
  address: string;
  className?: string;
  typographyProps?: TypographyProps;
  copyIconProps?: IconBaseProps;
  copyCompleteText?: string;
}

const Container = styled(Stack)`
  cursor: pointer;
  flex-direction: row;
  align-content: center;
`;

const StyledCopyIcon = styled(CopyIcon)<any>`
  min-width: 16px;
`;

export function SimpleAddressK2({
  className,
  address,
  typographyProps = {},
  copyIconProps = {},
  copyCompleteText = 'Copied!',
}: SimpleAddressProps) {
  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    toast.success(copyCompleteText, { duration: 2000 });
  };

  return (
    <Container
      sx={{
        textAlign: 'center',
        gap: 1,
      }}
      onClick={copyAddress}
      className={className}
    >
      <StyledCopyIcon height="12px" {...copyIconProps} />
      <Typography variant="caption" {...typographyProps}>
        {truncateAddress(address)}
      </Typography>
    </Container>
  );
}
