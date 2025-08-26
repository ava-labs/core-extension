import { Box, Button, Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { MdCurrencyBitcoin } from 'react-icons/md';
import { UnderConstruction } from './UnderConstruction';

export const AssetsTab: FC = () => {
  return (
    <Stack direction="column" gap={1.25} height={1}>
      <Box height={40} bgcolor="background.paper" borderRadius={2} px={2}>
        <Typography variant="subtitle3">
          <strong>Token</strong>, <strong>Trending</strong> and{' '}
          <strong>Placeholder</strong> are trading today.
        </Typography>
      </Box>
      <Stack direction="row" gap={1.25}>
        <Button variant="outlined" size="small">
          Filter
        </Button>
        <Button variant="outlined" size="small">
          Sort
        </Button>
        <Box ml="auto">
          <Button variant="outlined" size="small">
            Manage
          </Button>
        </Box>
      </Stack>
      <UnderConstruction
        title="Assets"
        description="Your assets will be displayed here. We're working hard to bring you this feature soon!"
        icon={<MdCurrencyBitcoin size={24} />}
      />
    </Stack>
  );
};
