import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { MdSwitchAccount } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

export const UnderConstruction: FC = () => {
  const theme = useTheme();
  const history = useHistory();

  return (
    <Stack
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center"
      spacing={4}
      sx={{
        background: `linear-gradient(135deg, ${
          theme.palette.primary.main
        }08 0%, ${theme.palette.secondary.main}08 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '30%',
          background: `linear-gradient(-45deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      {/* Main content */}
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          paddingInline: 2,
          borderRadius: theme.shape.largeBorderRadius,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: 'none',
          background: 'none',
        }}
      >
        <CardContent>
          <Stack spacing={3} alignItems="center" textAlign="center">
            {/* Construction icon */}
            <Box
              sx={{
                fontSize: '4rem',
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
                We&apos;re building something amazing! The new Core experience
                is currently in development and will be available soon.
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

            {/* Feature highlights */}
            <Stack spacing={1.5} width="100%">
              <Typography
                variant="subtitle2"
                color="text.secondary"
                textAlign="center"
              >
                What to expect:
              </Typography>
              <Stack spacing={1}>
                {[
                  'Enhanced user interface',
                  'Improved performance',
                  'New features & capabilities',
                ].map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: theme.shape.mediumBorderRadius,
                      backgroundColor: theme.palette.action.hover,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>

            {/* Action button */}
            <Box sx={{ pt: 2 }}>
              <IconButton
                onClick={() => history.push('/account-management')}
                size="large"
                color="primary"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  width: 56,
                  height: 56,
                }}
              >
                <MdSwitchAccount size={24} />
              </IconButton>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 1 }}
              >
                Access Account Management
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
