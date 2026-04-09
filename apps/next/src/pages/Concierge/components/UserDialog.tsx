import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';

export const UserDialog = ({ message }: { message: { content: string } }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  // Light mode: black background, white text
  // Dark mode: white background, dark text
  const backgroundColor = isLight ? '#28282E' : '#FFFFFF';
  const textColor = isLight ? '#FFFFFF' : '#28282E';

  return (
    <Stack
      sx={{
        backgroundColor,
        py: 1,
        px: 1.5,
        my: 0.75,
        maxWidth: '80%',
        width: 'fit-content',
        borderRadius: '20px 4px 20px 20px',
        alignSelf: 'flex-end',
        wordWrap: 'break-word',
        color: textColor,
      }}
    >
      <Typography>{message.content}</Typography>
    </Stack>
  );
};
