import { Stack, Typography } from '@avalabs/k2-alpine';

export function CollectibleListEmpty({ title }: { title: string }) {
  return (
    <Stack
      sx={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        mt: 5,
      }}
    >
      <Typography
        variant="h1"
        component="span"
        sx={{ mb: 2, fontWeight: 'medium' }}
      >
        🌵
      </Typography>
      <Typography variant="body3" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    </Stack>
  );
}
