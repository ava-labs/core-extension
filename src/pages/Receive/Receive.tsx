import {
  VerticalFlex,
  Typography,
  LoadingIcon,
  PrimaryAddress,
} from '@avalabs/react-components';

import { useWalletContext } from '@src/contexts/WalletProvider';
import styled from 'styled-components';
import { QRCodeWithLogo } from '@src/components/common/QRCodeWithLogo';
import { PageTitleMiniMode } from '@src/components/common/PageTitle';
import { AvalancheQRCodeLogo } from '@src/components/icons/AvalancheQRCodeLogo';

const StyledPrimaryAddress = styled(PrimaryAddress)`
  width: 100%;
`;

export const Receive = () => {
  const { addresses } = useWalletContext();
  const getAddress = () => {
    return addresses.addrC;
  };

  if (!addresses || !addresses.addrC) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex width="100%" align="center">
      <PageTitleMiniMode>Receive</PageTitleMiniMode>
      <VerticalFlex width={'100%'} grow="1" align="center" justify="center">
        <QRCodeWithLogo size={256} value={getAddress()}>
          <AvalancheQRCodeLogo
            position={'absolute'}
            text={'C-Chain'}
            size={102}
          />
        </QRCodeWithLogo>
      </VerticalFlex>
      <VerticalFlex padding="0 16px 24px" width="100%">
        <Typography size={12} height="15px" margin="0 0 4px">
          C-Chain Address
        </Typography>
        <StyledPrimaryAddress
          truncateLength={24}
          isTruncated={true}
          address={getAddress()}
        />
      </VerticalFlex>
    </VerticalFlex>
  );
};
