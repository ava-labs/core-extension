import { Box, CircularProgress } from '@avalabs/k2-alpine';
import { FC } from 'react';

export const PortfolioTabLoadingSpinner: FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      mt={5}
    >
      <CircularProgress size={24} />
    </Box>
  );
};
