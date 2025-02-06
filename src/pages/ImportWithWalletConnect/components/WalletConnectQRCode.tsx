import QRCode from 'qrcode.react';
import { Box, useTheme } from '@avalabs/core-k2-components';

import type { AccountImportStatus } from '@src/contexts/WalletConnectContextProvider/models';

import { getColorForStatus } from './utils/getColorForStatus';

type Props = {
  uri: string;
  status: AccountImportStatus;
};

export const WalletConnectQRCode = ({ uri, status }: Props) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'inline-block',
        background: theme.palette.common.white,
        p: 0.5,
        borderRadius: 1,
        width: 200,
        height: 200,
        border: '2px solid transparent',
        transition: theme.transitions.create('border-color'),
        borderColor: getColorForStatus(status),
      }}
    >
      <QRCode
        renderAs="svg"
        fgColor={theme.palette.common.black}
        bgColor={theme.palette.common.white}
        value={uri}
        level="H"
        size={188}
      />
    </Box>
  );
};
