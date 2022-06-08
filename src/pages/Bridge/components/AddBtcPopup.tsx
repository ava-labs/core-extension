import {
  Card,
  CloseIcon,
  HorizontalFlex,
  Overlay,
  PrimaryAddress,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { QRCodeWithLogo } from '@src/components/common/QRCodeWithLogo';
import { StyledNumberList } from '@src/components/common/StyledNumberList';
import { BtcQRCodeLogo } from '@src/components/icons/BtcQRCodeLogo';
import { useTheme } from 'styled-components';

interface AddBtcPopupProps {
  address: string;
  onClose: () => void;
}

export function AddBtcPopup({ onClose, address }: AddBtcPopupProps) {
  const theme = useTheme();
  return (
    <Overlay padding="24px 16px">
      <Card
        direction="column"
        height={'100%'}
        width={'100%'}
        padding="0"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
        }}
      >
        <HorizontalFlex
          justify="space-between"
          align="center"
          width="100%"
          margin="16px 0 8px"
          padding="0 16px"
        >
          <Typography size={20} weight={600} height="29px">
            Accounts
          </Typography>
          <TextButton onClick={() => onClose()}>
            <CloseIcon height="18px" color={theme.colors.icon1} />
          </TextButton>
        </HorizontalFlex>
        <VerticalFlex padding="16px" grow="1">
          <VerticalFlex grow="1" align="center">
            <Typography size={14} height="17px">
              To bridge you will first need to send your bitcoin to your CORE
              address...
            </Typography>
            <HorizontalFlex margin="24px 0">
              <StyledNumberList>1.</StyledNumberList>
              <Typography size={12} height="15px">
                Copy or scan your CORE bitcoin address below
              </Typography>
            </HorizontalFlex>

            <HorizontalFlex margin="0 0 24px 0">
              <StyledNumberList>2.</StyledNumberList>
              <Typography size={12} height="15px">
                Send your existing bitcoin to the copied or scanned address
              </Typography>
            </HorizontalFlex>

            <HorizontalFlex margin="0 0 24px">
              <StyledNumberList>3.</StyledNumberList>
              <Typography size={12} height="15px">
                When the bitcoin arrives in your CORE address you will be ready
                to bridge
              </Typography>
            </HorizontalFlex>
            <QRCodeWithLogo size={148} value={address}>
              <BtcQRCodeLogo position={'absolute'} text={'Bitcoin'} size={64} />
            </QRCodeWithLogo>
          </VerticalFlex>
          <Typography size={12} height="15px" margin="0 0 4px">
            CORE bitcoin Address
          </Typography>
          <PrimaryAddress
            address={address}
            withQR={false}
            isTruncated={false}
          />
        </VerticalFlex>
      </Card>
    </Overlay>
  );
}
