import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useStore } from '@src/store/store';
import { observer } from 'mobx-react-lite';
import { Progress } from '@src/components/misc/progress';
import { useTranslation } from 'react-i18next';

export const Onboard = observer(
  (): React.ReactElement => {
    const { t } = useTranslation();

    return (
      <Red>
        <Progress currentPosition={1} totalDots={3} />
        <h1 className=''> {t('home.desc')}</h1>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/test'>test</Link>
          </li>
          <li
            onClick={() =>
              chrome.tabs.create({ url: 'popup.html', active: false })
            }
          >
            asdf
          </li>
        </ul>
      </Red>
    );
  }
);

export const Red = styled.div`
  color: red;
`;
