import {
  CaretIcon,
  HorizontalFlex,
  IconDirection,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';

export const PageTitleMiniMode = ({ children, showBack = false }) => {
  const theme = useTheme();
  const history = useHistory();

  return (
    <HorizontalFlex width="100%" align="center" padding="12px 24px">
      {showBack && (
        <TextButton onClick={() => history.goBack()}>
          <CaretIcon
            height="21px"
            color={theme.colors.icon1}
            direction={IconDirection.LEFT}
          />
        </TextButton>
      )}
      <Typography as="h1" size={24} weight={600} padding="0px 12px">
        {children}
      </Typography>
    </HorizontalFlex>
  );
};

export const PageContentMiniMode = (props) => (
  <VerticalFlex
    grow="1"
    align="center"
    width="100%"
    padding="0 16px 16px 16px"
    {...props}
  />
);
