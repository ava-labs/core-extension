import { useState } from 'react';
import { DataItem } from '@avalabs/vm-module-types';
import { ChevronRightIcon, styled, useTheme } from '@avalabs/k2-alpine';

import { TxDetailsRow } from '../DetailRow';
import { RawDataDialog } from './RawDataDialog';

type RawDataDetailProps = {
  item: DataItem;
};

export const RawDataDetail = ({ item }: RawDataDetailProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  return (
    <>
      <ButtonDetailRow
        label={item.label}
        role="button"
        onClick={(e) => setAnchorEl(e.target as HTMLDivElement)}
      >
        <ChevronRightIcon
          size={22}
          sx={{ color: theme.palette.text.disabled, mr: -1 }}
        />
      </ButtonDetailRow>
      <RawDataDialog
        title={item.label}
        data={item.value}
        onClose={() => setAnchorEl(null)}
        open={!!anchorEl}
      />
    </>
  );
};

const ButtonDetailRow = styled(TxDetailsRow)({
  cursor: 'pointer',
});
