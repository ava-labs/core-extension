import { PageTopBar } from '@/components/PageTopBar';
import { Stack } from '@avalabs/k2-alpine';

export const AddNetworkFlow = () => {
  return (
    <Stack
      height="100cqh"
      width={1}
      bgcolor="background.backdrop"
      overflow="hidden"
      sx={{ position: 'relative' }}
    >
      <PageTopBar showBack={true} />
      <div>AddNetworkFlow</div>;
    </Stack>
  );
};
