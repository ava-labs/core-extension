import { Button, Grid, Stack, Typography } from '@avalabs/core-k2-components';
import { AppBackground } from './AppBackground';

// This will create a fake background that overlay is going to blur for design.
export const FakeOnboardingBackground = () => (
  <Grid container spacing={2}>
    <Grid item xs={6} md={6} sx={{ px: 20 }}>
      <Stack
        sx={{
          height: 724,
          width: 550,
          justifyContent: 'space-between',
          pt: 10,
          pl: 15,
        }}
      >
        <Stack
          sx={{
            pt: 15,
            justifyContent: 'center',
          }}
        >
          <Typography variant="h2">
            {'The best way to connect to crypto'}
          </Typography>
          <Typography variant="h2" sx={{ color: 'secondary.main' }}>
            {'Core Extension'}
          </Typography>
        </Stack>

        <Stack
          sx={{
            p: 10,
            justifyContent: 'center',
          }}
        >
          <Button sx={{ width: 300 }}>{'Next'}</Button>
        </Stack>
      </Stack>
    </Grid>
    <Grid
      item
      xs={6}
      md={6}
      sx={{
        backgroundColor: 'background.paper',
      }}
    >
      <AppBackground />
    </Grid>
  </Grid>
);
