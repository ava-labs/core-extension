import { Card } from '@/components/Card';
import { Button, Grid2, Stack, toast, Typography } from '@avalabs/k2-alpine';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  phrase: string;
};

const PhraseCard: FC<Props> = ({ phrase }) => {
  const { t } = useTranslation();
  return (
    <Stack gap={2}>
      <Card>
        <Grid2
          container
          rowSpacing={1.5}
          columnSpacing={2.5}
          pl={1.25}
          pr={4}
          py={2.5}
        >
          {phrase.split(' ').map((word, index) => (
            <Grid2
              key={index}
              size={4}
              display="flex"
              direction="row"
              alignItems="center"
              columnGap={0.5}
            >
              <Typography
                variant="subtitle4"
                color="text.secondary"
                textAlign="center"
                width={20}
              >
                {index + 1}
              </Typography>
              <Typography variant="subtitle4">{word}</Typography>
            </Grid2>
          ))}
        </Grid2>
      </Card>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        sx={{ mx: 'auto' }}
        onClick={() => {
          navigator.clipboard.writeText(phrase);
          toast.success(t('Recovery phrase copied to clipboard'), {
            id: 'recovery-phrase-copied',
          });
        }}
      >
        {t('Copy phrase')}
      </Button>
    </Stack>
  );
};

const PhraseCardMemo = memo(PhraseCard);

export { PhraseCardMemo as PhraseCard };
