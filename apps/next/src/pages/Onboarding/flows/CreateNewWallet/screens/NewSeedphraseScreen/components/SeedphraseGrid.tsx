import { Grid2, Typography, useTheme, Paper } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { wordlists } from 'bip39';

type SeedphraseGridProps = {
  phrase: string;
};

export const SeedphraseGrid: FC<SeedphraseGridProps> = ({ phrase }) => {
  const theme = useTheme();
  const words = phrase.split(/\s+/);

  return (
    <Paper sx={{ px: 3, py: 2, borderRadius: theme.shape.mediumBorderRadius }}>
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
              <Typography variant="body2" color="text.primary">
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

const FakeWord = () => (
  <Typography
    component="span"
    translate="no"
    sx={{
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: -1,
      opacity: 0,
    }}
  >
    {getRandomSeedphraseWord()}
  </Typography>
);

export const getRandomSeedphraseWord = (wordlist = 'english'): string => {
  const words = wordlists[wordlist];

  if (!words) {
    throw new Error(`Unknown wordlist: ${wordlist}`);
  }

  const rand = Math.floor(Math.random() * words.length);

  return words[rand] as string;
};
