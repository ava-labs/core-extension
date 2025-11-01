import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';

export const UserDialog = ({ message }) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        backgroundColor: theme.palette.common.white,
        py: 1,
        px: 2,
        my: 1,
        maxWidth: '80%',
        width: 'fit-content',
        borderRadius: '20px',
        borderTopRightRadius: '3px',
        alignSelf: 'flex-end',
        wordWrap: 'break-word',
        color: theme.palette.grey[900],
      }}
    >
      <Typography>{message.content}</Typography>
    </Stack>
  );
};
