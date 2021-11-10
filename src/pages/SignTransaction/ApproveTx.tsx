import React from 'react';
import {
  Typography,
  VerticalFlex,
  TokenImg,
  GlobeIcon,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';

const SiteAvatar = styled(VerticalFlex)<{ margin: string }>`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.bg2};
  border-radius: 50%;
  margin: ${({ margin }) => margin ?? '0px'};
`;

export function ApproveTx(props) {
  const { site } = props;
  const theme = useTheme();

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <Typography as="h1" size={24} weight={700}>
        Approval Summary
      </Typography>
      <SiteAvatar margin="16px" justify="center" align="center">
        {site.icon ? (
          <TokenImg height="48px" width="48px" src={site?.icon} />
        ) : (
          <GlobeIcon height="48px" color={theme.colors.icon1} />
        )}
      </SiteAvatar>
      <Typography>
        Allow {site?.domain} to spend your {'token'}
      </Typography>
    </VerticalFlex>
  );
}
