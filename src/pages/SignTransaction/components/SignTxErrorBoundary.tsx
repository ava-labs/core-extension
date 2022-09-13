import {
  Card,
  HorizontalFlex,
  PrimaryButton,
  SecondaryButton,
  SubTextTypography,
  Typography,
  VerticalFlex,
  toast,
  ComponentSize,
  CustomToast,
} from '@avalabs/react-components';
import { Component } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import styled from 'styled-components';

const Header = styled(Typography)`
  color: ${({ theme }) => theme.colors.primary1};
  font-weight: 600;
  font-size: 20px;
  line-height: 29px;
  padding: 12px 0;
`;

/**
 * This catches all errors in the UI at the sign tx level. Essentially this is a catch all if the sign tx render boundary fails to catch the issue then this should do it
 */
export class SignTxErrorBoundary extends Component<
  any,
  { hasError: boolean; error?: string; errorStack?: string }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: '', errorStack: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error.message, errorStack: error.stack };
  }

  render() {
    if (this.state.hasError) {
      return (
        <VerticalFlex width={'100%'} align="center" padding="0 16px">
          <Header>Error</Header>
          <SubTextTypography margin={'8px 0 0'} align="center">
            Something went wrong while opening the confirm for this transaction.
            Copy the below error and post it in our discord, telegram or one of
            our social channels so our developers can address it as soon as
            possible. We apologize for the inconvenience.
          </SubTextTypography>
          <Card margin={'24px 0 0'} height="340px" padding="16px 0">
            <Scrollbars>
              <VerticalFlex padding="0 16px">
                <Typography size={14} height="17px" wordBreak={'break-word'}>
                  {this.state.errorStack}
                </Typography>
              </VerticalFlex>
            </Scrollbars>
          </Card>
          <HorizontalFlex
            width="100%"
            flex={1}
            align="flex-end"
            justify="space-between"
            margin={'0 0 8px 0'}
          >
            <SecondaryButton
              size={ComponentSize.LARGE}
              width="168px"
              onClick={() => window.close()}
            >
              Close
            </SecondaryButton>
            <PrimaryButton
              size={ComponentSize.LARGE}
              width="168px"
              onClick={() => {
                navigator.clipboard.writeText(this.state.errorStack ?? '');
                toast.custom(<CustomToast label="Copied!" />, {
                  duration: 2000,
                });
              }}
            >
              Copy
            </PrimaryButton>
          </HorizontalFlex>
        </VerticalFlex>
      );
    }

    return this.props.children;
  }
}