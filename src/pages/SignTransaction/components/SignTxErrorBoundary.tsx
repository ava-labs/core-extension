import {
  Card,
  HorizontalFlex,
  PrimaryButton,
  SecondaryButton,
  SubTextTypography,
  Typography,
  VerticalFlex,
  toast,
} from '@avalabs/react-components';
import { Component } from 'react';
import styled from 'styled-components';

const Header = styled(Typography)`
  color: ${({ theme }) => theme.colors.primary1};
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
        <VerticalFlex width={'100%'} align="center">
          <Header size={18}>Error</Header>
          <SubTextTypography margin={'8px 0'} align="center">
            Something went wrong while opening the confirm for this transaction.
            Copy the below error and post it in our discord, telegram or one of
            our social channels so our developers can address it as soon as
            possible. We apologize for the inconvenience.
          </SubTextTypography>
          <Card margin={'20px 0 8px 0'}>
            <Typography
              wordBreak={'break-word'}
              style={{ maxHeight: '325px', overflow: 'auto' }}
            >
              {this.state.errorStack}
            </Typography>
          </Card>
          <HorizontalFlex
            width="100%"
            flex={1}
            align="flex-end"
            justify="space-between"
            margin={'40px 0 0 0'}
          >
            <SecondaryButton onClick={() => window.close()}>
              Close
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                navigator.clipboard.writeText(this.state.errorStack ?? '');
                toast.success('Copied');
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
