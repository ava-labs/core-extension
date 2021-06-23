import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useStore } from '@src/store/store';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { browser } from 'webextension-polyfill-ts';

export const Welcome = observer((): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <Container>
      <h1>Avvy</h1>
      <p>{t('home.desc')}</p>
      <Link to="/welcome/create">
        <Button> Create a new wallet</Button>
      </Link>
      <Link to="/import">
        <Button>import existing wallet</Button>
      </Link>
      <Button onClick={() => browser.tabs.create({ url: '/popup.html' })}>
        open in tab
      </Button>
    </Container>
  );
});

export const Container = styled.div`
  magin: 0 auto;
  text-align: center;
  padding: 1.5rem;
`;

export const Button = styled.div`
  border-radius: 5px;
  text-align: center;
  padding: 0.5rem;
  width: 100%;
`;
