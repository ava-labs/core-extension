import {
  Overlay,
  HorizontalFlex,
  TextButton,
  CaretIcon,
  IconDirection,
} from '@avalabs/react-components';
import { PropsWithChildren } from 'react';
import styled, { useTheme } from 'styled-components';

const FullSizeHeader = styled(HorizontalFlex)`
  background-color: ${({ theme }) => `${theme.colors.bg1}80`};
  padding: 30px 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
`;

interface ImageWrapperProps {
  isOverlay: boolean;
  onClick: () => void;
  onClose: () => void;
}

export function ImageWrapper({
  isOverlay,
  onClick,
  onClose,
  children,
}: PropsWithChildren<ImageWrapperProps>) {
  const theme = useTheme();
  if (isOverlay) {
    return (
      <Overlay>
        <FullSizeHeader>
          <TextButton onClick={onClose}>
            <CaretIcon
              height="17px"
              color={theme.colors.icon1}
              direction={IconDirection.LEFT}
            />
          </TextButton>
        </FullSizeHeader>
        {children}
      </Overlay>
    );
  }
  return (
    <HorizontalFlex onClick={onClick} width="100%">
      {children}
    </HorizontalFlex>
  );
}
