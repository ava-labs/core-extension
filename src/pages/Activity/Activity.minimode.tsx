import {
  CloseIcon,
  HorizontalFlex,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import React from 'react';
import { useHistory } from 'react-router';
import { useTheme } from 'styled-components';

export function ActivityMiniMode() {
  const history = useHistory();
  const theme = useTheme();

  return (
    <VerticalFlex>
      <HorizontalFlex>
        <TextButton>
          <CloseIcon
            height={'27px'}
            fill={theme.palette.white}
            onClick={() => history.goBack()}
          />
        </TextButton>
      </HorizontalFlex>
      <Typography>This is activity</Typography>
    </VerticalFlex>
  );
}
