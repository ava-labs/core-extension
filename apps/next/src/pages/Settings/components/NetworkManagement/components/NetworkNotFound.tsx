import { Page } from '@/components/Page';
import { Stack, Typography } from '@avalabs/k2-alpine';

export const NetworkNotFound = () => {
  return (
    <Page withBackButton>
      <Stack>
        <Typography variant="h2">Network not found</Typography>
      </Stack>
    </Page>
  );
};
