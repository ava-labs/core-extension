import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useStore } from '@src/store/store';
import { observer } from 'mobx-react-lite';

import { useTranslation } from 'react-i18next';

export const Hello = observer(
  (): React.ReactElement => {
    const { t } = useTranslation();

    const { extensionStore } = useStore();

    return (
      <Red>
        <h1 className=''> {t('access.title')}</h1>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/welcome'>Welcome</Link>
          </li>
          <li>
            <Link to='/test'>test</Link>
          </li>
          <li
            onClick={() =>
              chrome.tabs.create({ url: 'popup.html', active: false })
            }
          >
            open in new tab
          </li>
        </ul>
      </Red>
    );
  }
);

export const Red = styled.div`
  color: red;
`;
