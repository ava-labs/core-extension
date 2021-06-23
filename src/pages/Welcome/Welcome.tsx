import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
} from '@avalabs/react-components';

export const Welcome = observer((): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <VerticalFlex align={'center'} padding={'0 10px'}>
      <Typography>{t('home.desc')}</Typography>
      <Link to="/welcome/create">
        <PrimaryButton>Create a new wallet</PrimaryButton>
      </Link>
      <Link to="/import">
        <PrimaryButton>import existing wallet</PrimaryButton>
      </Link>
    </VerticalFlex>
  );
});
