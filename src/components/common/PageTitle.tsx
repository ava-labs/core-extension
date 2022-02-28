import {
  HorizontalFlex,
  CaretIcon,
  IconDirection,
  Typography,
  TextButton,
} from '@avalabs/react-components';
import { PropsWithChildren } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

const BackButton = styled(TextButton)<{ padding?: string }>`
  padding: ${({ padding }) => padding ?? '4px 8px 4px 16px'};
`;

export enum PageTitleVariant {
  SECONDARY, // When beneath the global header.
  PRIMARY, // Use this when the global header is hidden and this is the primary page header.
}

type PageTitleMiniModeProps = {
  onBackClick?(): void;
  showBackButton?: boolean;
  variant?: PageTitleVariant;
  buttonPadding?: string;
};

export const PageTitleMiniMode = ({
  children,
  onBackClick,
  showBackButton = true,
  variant = PageTitleVariant.SECONDARY,
  buttonPadding,
}: PropsWithChildren<PageTitleMiniModeProps>) => {
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
      height="53px"
      width="100%"
      paddingTop={variant === PageTitleVariant.PRIMARY ? '16px' : undefined}
    >
      {showBackButton && (
        <BackButton
          onClick={() => (onBackClick ? onBackClick() : goBack())}
          padding={buttonPadding}
        >
          <CaretIcon
            height="20px"
            width="20px"
            color={theme.colors.icon1}
            direction={IconDirection.LEFT}
          />
        </BackButton>
      )}
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
