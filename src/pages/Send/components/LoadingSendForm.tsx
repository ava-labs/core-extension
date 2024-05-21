import { Skeleton, Stack } from '@avalabs/k2-components';

type Props = { withTitle?: boolean };

export const LoadingSendForm = ({ withTitle }: Props) => {
  return (
    <Stack sx={{ flexGrow: 1, width: 1, pt: 1, px: 2 }}>
      {withTitle && (
        <Skeleton variant="rounded" sx={{ width: 100, height: 48, my: 1 }} />
      )}
      <Skeleton variant="text" width={100} />
      <Skeleton variant="rounded" height={62} />
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}
      >
        <Skeleton variant="text" sx={{ width: 80, mt: 4 }} />
        <Skeleton variant="text" sx={{ width: 60, height: 20, mt: 4 }} />
      </Stack>
      <Skeleton variant="rounded" height={55} />
      <Skeleton
        variant="text"
        sx={{ width: 60, height: 20, alignSelf: 'flex-end' }}
      />
    </Stack>
  );
};
