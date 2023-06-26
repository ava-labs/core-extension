import { Skeleton, Stack, styled } from '@avalabs/k2-components';

const ReviewLoadingContainer = styled('div')`
  padding: 0 16px;
`;

export const ReviewLoading = () => {
  return (
    <ReviewLoadingContainer>
      <Skeleton variant="text" sx={{ mt: 1, mb: 0.5, mx: 0 }} width={40} />
      <Skeleton variant="rounded" height={68} />
      <Skeleton variant="text" sx={{ mt: 2, mb: 0.5, mx: 0 }} width={20} />
      <Skeleton variant="rounded" height={68} />
      <Skeleton sx={{ width: '100%', mt: 3, mb: 2, mx: 0 }} height={2} />
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          my: 2,
          mx: 0,
        }}
      >
        <Skeleton variant="text" sx={{ width: '20%' }} />
      </Stack>
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: 2,
          mx: 0,
        }}
      >
        <Skeleton variant="text" sx={{ width: '20%' }} />
        <Skeleton variant="text" sx={{ width: '50%' }} />
      </Stack>
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: 2,
          mx: 0,
        }}
      >
        <Skeleton variant="text" sx={{ width: '50%' }} />
        <Skeleton variant="text" sx={{ width: '10%' }} />
      </Stack>
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: 2,
          mx: 0,
        }}
      >
        <Skeleton variant="text" sx={{ width: '30%' }} />
        <Skeleton variant="text" sx={{ width: '25%' }} />
      </Stack>
    </ReviewLoadingContainer>
  );
};
