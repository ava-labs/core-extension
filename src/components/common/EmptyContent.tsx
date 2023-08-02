import { Stack, Grow, Typography } from '@avalabs/k2-components';

interface EmptyContentProps {
  text: string;
}

const commonTransitionProps = {
  timeout: 500,
  easing: 'ease-in-out',
  appear: true,
};

export function EmptyContent({ text }: EmptyContentProps) {
  return (
    <Grow {...commonTransitionProps} in>
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: '1',
          height: '100%',
        }}
      >
        <Typography data-testid="empty-list-text" variant="body2">
          {text}
        </Typography>
      </Stack>
    </Grow>
  );
}
