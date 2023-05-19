import React from 'react';
import {
  Typography,
  toast,
  CopyIcon,
  Stack,
  IconButton,
  styled,
} from '@avalabs/k2-components';
import { truncateAddress } from '@src/utils/truncateAddress';

interface AddressProps {
  name?: string;
  address: string;
  isTruncated?: boolean;
  className?: string;
  truncateLength?: number;
}

const Container = styled(Stack)`
  background: ${({ theme }) => theme.palette.grey[850]};
  padding: 8px 16px;
  border-radius: ${({ theme }) => `${theme.shape.borderRadius}px`};
  align-items: center;
  justify-content: space-between;
`;

function AddressContentK2({
  name,
  address,
  isTruncated = true,
  truncateLength = 9,
}: AddressProps) {
  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    toast.success('Copied!', { duration: 2000 });
  };

  return (
    <>
      {name && (
        <Typography
          height="24px"
          sx={{
            my: 0,
            mr: 1.5,
            ml: 0,
          }}
        >
          {name}
        </Typography>
      )}
      <Stack
        sx={{
          flex: `${name ? 0 : 1}`,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            my: 0,
            mr: 1.5,
            ml: 0,
          }}
        >
          {isTruncated ? truncateAddress(address, truncateLength) : address}
        </Typography>
        <Stack>
          <IconButton size="small" onClick={copyAddress}>
            <CopyIcon />
          </IconButton>
        </Stack>
      </Stack>
    </>
  );
}

export function PrimaryAddressK2(props: AddressProps) {
  return (
    <Container className={props.className}>
      <AddressContentK2 {...props} />
    </Container>
  );
}
