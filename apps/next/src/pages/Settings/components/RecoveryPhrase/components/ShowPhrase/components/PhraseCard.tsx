import { Card } from '@/components/Card';
import { FakeWord } from '@/components/FakeWord';
import {
  Button,
  Grid2,
  Skeleton,
  Stack,
  toast,
  Typography,
} from '@avalabs/k2-alpine';
import { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  phrase: string;
  hidden?: boolean;
};

const PhraseCard: FC<Props> = ({ phrase, hidden }) => {
  const { t } = useTranslation();
  const [isHidden, setIsHidden] = useState(hidden ?? false);

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
                sx={{ userSelect: 'none' }}
              >
                {index + 1}
              </Typography>
              {isHidden ? (
                <Skeleton
                  variant="text"
                  width={word.length + 'ch'}
                  height="1em"
                />
              ) : (
                <>
                  {Math.random() < 0.5 && <FakeWord />}
                  <Typography variant="subtitle4">{word}</Typography>
                  {Math.random() < 0.5 && <FakeWord />}
                </>
              )}
            </Grid2>
          ))}
        </Grid2>
      </Card>
      <Stack direction="row" mx="auto" gap={1}>
        {hidden !== undefined && (
          <Button
            variant="contained"
            color="primary"
            size="extension"
            onClick={() => setIsHidden(!isHidden)}
          >
            {isHidden ? t('Show phrase') : t('Hide phrase')}
          </Button>
        )}
        <Button
          variant="contained"
          color="secondary"
          size="extension"
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
    </Stack>
  );
};

const PhraseCardMemo = memo(PhraseCard);

export { PhraseCardMemo as PhraseCard };
