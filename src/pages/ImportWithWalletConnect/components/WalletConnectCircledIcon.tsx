import { Box, WalletConnectIcon, useTheme } from '@avalabs/k2-components';

export const WalletConnectCircledIcon = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: '50%',
        width: 80,
        height: 80,
        backgroundColor: theme.palette.grey[800],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${theme.palette.secondary.main}`,
        mb: 1,
        p: 1,
      }}
    >
      <WalletConnectIcon size={64} />
    </Box>
  );
};
