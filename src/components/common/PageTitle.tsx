import {
  HorizontalFlex,
  CaretIcon,
  IconDirection,
  Typography,
  TextButton,
} from '@avalabs/react-components';
import { PropsWithChildren } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { useTheme, keyframes } from 'styled-components';
import { ImageWithFallback } from '@src/components/common/ImageWithFallback';

const ShowThumbnailImageAnimation = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

const BackButton = styled(TextButton)<{ padding?: string }>`
  padding: ${({ padding }) => padding ?? '4px 8px 4px 16px'};
`;

const ThumbnailImage = styled(ImageWithFallback)`
  width: 32px;
  height: 32px;
  margin-right: 8px;
  border-radius: 8px;
  animation: 0.3s ease-in-out ${ShowThumbnailImageAnimation};
`;

export enum PageTitleVariant {
  SECONDARY, // When beneath the global header.
  PRIMARY, // Use this when the global header is hidden and this is the primary page header.
}

type PageTitleProps = {
  onBackClick?(): void;
  showBackButton?: boolean;
  variant?: PageTitleVariant;
  buttonPadding?: string;
  thumbnailImage?: string;
  margin?: string;
};

export const PageTitle = ({
  children,
  onBackClick,
  showBackButton = true,
  variant = PageTitleVariant.SECONDARY,
  buttonPadding,
  thumbnailImage,
  margin = '8px 0',
}: PropsWithChildren<PageTitleProps>) => {
  const theme = useTheme();
  const history = useHistory();

  const goBack = () => {
    // history can be empty when the extension is opened and the last
    // location is loaded back from localstorage
    history.length <= 2 ? history.replace('/home') : history.goBack();
  };

  return (
    <HorizontalFlex
      align="center"
      position="relative"
      width="100%"
      paddingTop={variant === PageTitleVariant.PRIMARY ? '16px' : undefined}
      margin={margin}
    >
      {showBackButton && (
        <BackButton
          onClick={() => (onBackClick ? onBackClick() : goBack())}
          padding={buttonPadding}
          data-testid="page-title-back-button"
        >
          <CaretIcon
            height="20px"
            width="20px"
            color={theme.colors.icon1}
            direction={IconDirection.LEFT}
          />
        </BackButton>
      )}
      {thumbnailImage && <ThumbnailImage src={thumbnailImage} />}
      <Typography
        weight={500}
        size={20}
        width="100%"
        margin={showBackButton ? '0' : '0 0 0 16px'}
      >
        {children}
      </Typography>
    </HorizontalFlex>
  );
};
