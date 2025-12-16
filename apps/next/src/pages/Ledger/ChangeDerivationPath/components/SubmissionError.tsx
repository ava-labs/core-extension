import { Stack, Typography } from '@avalabs/k2-alpine';
import { isError } from 'lodash';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdError } from 'react-icons/md';

type Props = {
  error: unknown;
};

export const SubmissionError: FC<Props> = ({ error }) => {
  const { t } = useTranslation();
  const errorMessage = isError(error)
    ? error.message
    : typeof error === 'string'
      ? error
      : t('Unknown error');
  return (
    <Stack
      height={1}
      gap={2}
      alignItems="center"
      justifyContent="center"
      color="error.main"
    >
      <MdError size={72} />
      <Typography variant="subtitle1">{errorMessage}</Typography>
    </Stack>
  );
};
