import { Box, Stack, StackProps, Typography } from '@avalabs/k2-alpine';
import { FiAlertCircle } from 'react-icons/fi';

type ErrorStateProps = StackProps & {
  title: string;
  description: string | React.ReactNode;
  action?: React.ReactNode;
};

export const ErrorState = ({
  title,
  description,
  action,
  ...props
}: ErrorStateProps) => {
  return (
    <Stack width="100%" height="100%" gap={2}>
      <Stack
        gap={1}
        flexGrow={1}
        color="error.main"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={5}
        {...props}
      >
        <Box flexShrink={0}>
          <FiAlertCircle size={24} />
        </Box>
        <Stack gap={0.5}>
          <Typography variant="body3" fontWeight={500}>
            {title}
          </Typography>
          {typeof description === 'string' ? (
            <Typography variant="caption">{description}</Typography>
          ) : (
            description
          )}
        </Stack>
      </Stack>
      {action && <Stack gap={0.5}>{action}</Stack>}
    </Stack>
  );
};
