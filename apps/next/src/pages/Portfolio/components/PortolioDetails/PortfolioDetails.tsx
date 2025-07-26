import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC } from 'react';

export const PortfolioDetails: FC = () => {
  const theme = useTheme();

  return (
    <Stack
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center"
      spacing={4}
    >
      <Card
        sx={{
          width: '100%',
          paddingInline: 2,
          borderRadius: theme.shape.largeBorderRadius,
        }}
      >
        <CardContent>
          <Stack spacing={2} textAlign="center">
            <Box
              sx={{
                fontSize: '1rem',
                animation: 'bounce 2s infinite',
                '@keyframes bounce': {
                  '0%, 20%, 50%, 80%, 100%': {
                    transform: 'translateY(0)',
                  },
                  '40%': {
                    transform: 'translateY(-10px)',
                  },
                  '60%': {
                    transform: 'translateY(-5px)',
                  },
                },
              }}
            >
              🚧
            </Box>

            <Stack spacing={2} textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="primary">
                Under Construction
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
              >
                Your portfolio details will be displayed here. We&apos;re
                working hard to bring you this feature soon!
              </Typography>

              <Box sx={{ py: 1 }}>
                <Chip
                  label="Coming Soon"
                  color="primary"
                  variant="outlined"
                  sx={{
                    fontWeight: 'medium',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.7 },
                      '100%': { opacity: 1 },
                    },
                  }}
                />
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
