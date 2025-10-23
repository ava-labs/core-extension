import { Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheckCircle as DoneIcon } from 'react-icons/md';
import * as Styled from './Styled';

type Props = {
  required: number;
  received: number;
};

export const ConfirmationsCounter: FC<Props> = ({ required, received }) => {
  const { t } = useTranslation();
  const isConfirmed = received >= required;

  return (
    <>
      <Typography variant="body3" color="text.primary">
        {t('Confirmations')}
      </Typography>
      {isConfirmed ? (
        <Stack
          direction="row"
          alignItems="center"
          gap={0.5}
          color="success.main"
        >
          <DoneIcon />
          <Typography variant="body3" color="text.secondary" align="right">
            {t('Done')}
          </Typography>
        </Stack>
      ) : (
        <Typography variant="body3" color="text.primary">
          {t('{{received}} out of {{required}}', {
            received: received,
            required: required,
          })}
        </Typography>
      )}
      {!isConfirmed && (
        <Styled.ProgressItem
          variant="determinate"
          color="success"
          value={(received / required) * 100}
        />
      )}
    </>
  );
};
