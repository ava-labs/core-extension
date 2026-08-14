import { FakeWord } from '@/components/FakeWord';
import { Grid2, Paper, Typography, useTheme } from '@avalabs/k2-alpine';
import { FC } from 'react';

type SeedphraseGridProps = {
  phrase: string;
};

export const SeedphraseGrid: FC<SeedphraseGridProps> = ({ phrase }) => {
  const words = phrase.split(/\s+/);
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        px: 3,
        borderRadius: theme.shape.mediumBorderRadius,
        backgroundColor: 'background.navBarItem',
      }}
    >
      <Grid2 container spacing={1.5} component="ol">
        {Array.from({ length: words.length }, (_, i) => {
          const isFakeBeforeReal = Math.random() < 0.5;

          return (
            <Grid2
              size={{ xs: 6, sm: 4 }}
              key={i}
              component="li"
              sx={{ pl: 1, '::marker': { color: 'text.secondary' } }}
            >
              {isFakeBeforeReal && <FakeWord />}
              <Typography
                variant="body2"
                color="text.primary"
                data-testid="seedphrase-word"
                fontWeight={500}
              >
                {words[i]}
              </Typography>
              {!isFakeBeforeReal && <FakeWord />}
            </Grid2>
          );
        })}
      </Grid2>
    </Paper>
  );
};
