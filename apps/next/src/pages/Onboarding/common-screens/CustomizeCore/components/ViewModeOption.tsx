import { Stack, useTheme } from '@avalabs/k2-alpine';
import { ViewMode } from '@core/types';
import { FC } from 'react';
import { assets } from '../assets';
import * as Styled from './Styled';

export const ViewModeOption: FC<{
  viewMode: ViewMode;
  label: string;
}> = ({ viewMode, label }) => {
  const {
    palette: { mode: theme },
  } = useTheme();
  return (
    <Stack gap={1.25} px={1.5} py={4}>
      <img
        src={assets[theme][viewMode]}
        alt={viewMode}
        width={210}
        height={155}
      />
      <Styled.LabelButton variant="contained" size="small" disableRipple>
        {label}
      </Styled.LabelButton>
    </Stack>
  );
};
