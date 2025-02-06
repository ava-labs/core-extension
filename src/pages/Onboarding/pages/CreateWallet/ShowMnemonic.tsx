import {
  Button,
  CopyIcon,
  Grid,
  Stack,
  toast,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MnemonicProps } from './Mnemonic';
import { getRandomMnemonicWord } from '../../utils/getRandomMnemonicWord';

const FakeWord = () => (
  <Typography
    as="span"
    translate="no"
    sx={{
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: -1,
      opacity: 0,
    }}
  >
    {getRandomMnemonicWord()}
  </Typography>
);

export function ShowMnemonic({ phrase, wordCount = 24 }: MnemonicProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const words = phrase.split(' ');

  const inputs = useMemo(() => {
    const list: any[] = [];
    for (let num = 1; num <= wordCount; num++) {
      const isFakeBeforeReal = Math.random() < 0.5;

      list.push(
        <Grid item key={num}>
          <Stack
            sx={{
              width: theme.spacing(13),
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Typography
              variant="body2"
              sx={{ userSelect: 'none', minWidth: 2, mr: 1 }}
            >
              {num}.
            </Typography>
            {isFakeBeforeReal && <FakeWord />}
            <Typography as="span" variant="body2" translate="no">
              {words[num - 1]}
            </Typography>
            {!isFakeBeforeReal && <FakeWord />}
          </Stack>
        </Grid>,
      );
    }
    return list;
  }, [wordCount, words, theme]);

  const onCopy = () => {
    navigator.clipboard.writeText(phrase);
    toast.success(t('Copied!'), { duration: 2000, position: 'top-left' });
  };

  return (
    <Stack alignItems="flex-end">
      <Grid
        container
        sx={{
          backgroundColor: theme.palette.grey[850],
          height: theme.spacing(38),
          width: theme.spacing(44),
          justifyContent: 'space-between',
          alignItems: 'center',
          rowGap: 1.5,
          p: 2,
          borderRadius: 1,
          userSelect: 'none', // prevent user from manually selecting & copying the phrase, as it contains fake words in-between
        }}
        onCopy={(ev) => ev.preventDefault()}
      >
        {inputs}
      </Grid>
      <Button variant="text" onClick={onCopy} sx={{ color: 'secondary' }}>
        <CopyIcon size={16} />
        <Typography
          variant="caption"
          sx={{
            ml: 1,
          }}
        >
          {t('Copy Phrase')}
        </Typography>
      </Button>
    </Stack>
  );
}
