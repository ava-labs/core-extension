import { Card, Divider, Skeleton, Stack } from '@avalabs/core-k2-components';

export const BridgeFormSkeleton = () => (
  <Stack
    sx={{
      flex: 1,
      px: 2,
      flexGrow: 1,
      justifyContent: 'space-between',
    }}
  >
    <Stack sx={{ width: 1 }}>
      <Card
        sx={{
          width: 1,
          height: 176,
          p: 0,
          backgroundColor: 'grey.850',
          overflow: 'unset',
          zIndex: 1,
        }}
      >
        <Stack sx={{ width: 1, p: 2, gap: 1 }}>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Skeleton variant="text" sx={{ width: 35 }} />
            <Skeleton variant="rectangular" sx={{ width: 190, height: 24 }} />
          </Stack>
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Skeleton variant="text" sx={{ width: 80 }} />
            <Stack
              sx={{ gap: 0.5, textAlign: 'right', alignItems: 'flex-end' }}
            >
              <Skeleton variant="text" sx={{ width: 50 }} />
              <Skeleton variant="rectangular" sx={{ width: 190, height: 40 }} />
              <Skeleton variant="text" sx={{ width: 50 }} />
            </Stack>
          </Stack>
        </Stack>
      </Card>
      <Card
        sx={{
          width: 1,
          height: 150,
          p: 0,
          backgroundColor: 'none',
          mt: -1,
        }}
      >
        <Stack sx={{ width: 1, p: 2, gap: 1, pt: 4 }}>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Skeleton variant="text" sx={{ width: 35 }} />
            <Skeleton variant="text" sx={{ width: 150 }} />
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Skeleton variant="text" sx={{ width: 60 }} />
          <Skeleton variant="text" sx={{ width: 60 }} />
        </Stack>
      </Card>
    </Stack>
    {/* <Skeleton variant="rectangular" sx={{ width: 1, height: 326 }} /> */}
    <Stack sx={{ height: 76, alignItems: 'center' }}>
      <Skeleton variant="rectangular" sx={{ width: 1, height: 40 }} />
    </Stack>
  </Stack>
);
