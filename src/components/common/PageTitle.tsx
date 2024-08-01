import { PropsWithChildren } from 'react';
import { useHistory } from 'react-router-dom';
import { ImageWithFallback } from '@src/components/common/ImageWithFallback';
import {
  ChevronLeftIcon,
  IconButton,
  Stack,
  Typography,
  styled,
  keyframes,
} from '@avalabs/core-k2-components';

const ShowThumbnailImageAnimation = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
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
  const history = useHistory();

  const goBack = () => {
    // history can be empty when the extension is opened and the last
    // location is loaded back from localstorage
    history.length <= 2 ? history.replace('/home') : history.goBack();
  };

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        position: 'relative',
        width: '100%',
        pt: variant === PageTitleVariant.PRIMARY ? 2 : 0,
        margin,
      }}
    >
      {showBackButton && (
        <IconButton
          onClick={() => (onBackClick ? onBackClick() : goBack())}
          padding={buttonPadding}
          data-testid="page-title-back-button"
          disableRipple
        >
          <ChevronLeftIcon size={32} />
        </IconButton>
      )}
      {thumbnailImage && <ThumbnailImage src={thumbnailImage} />}
      <Typography
        variant="h4"
        sx={{
          width: '100%',
          marginLeft: showBackButton ? 0 : 2,
          pt: 1,
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
};
