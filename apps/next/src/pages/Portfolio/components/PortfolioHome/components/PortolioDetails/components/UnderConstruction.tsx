import { Box, Chip, Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';

type Props = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export const UnderConstruction: FC<Props> = ({ title, description, icon }) => {
  return (
    <Stack
      height={1}
      overflow="auto"
      sx={{
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Stack
        gap={1}
        px={1}
        py={1}
        height={1}
        flexShrink={1}
        borderRadius={4}
        textAlign="center"
        bgcolor="background.paper"
        justifyContent="center"
      >
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
          {icon ?? '🚧'}
        </Box>

        <Stack gap={1} textAlign="center">
          <Typography variant="h5" fontWeight="bold" color="primary">
            {title}
          </Typography>

          <Typography
            variant="body3"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {description}
          </Typography>

          <Box>
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
    </Stack>
  );
};
