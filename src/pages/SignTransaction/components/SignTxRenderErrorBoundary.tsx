import {
  Card,
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
  toast,
  TextButton,
  CopyIcon,
} from '@avalabs/react-components';
import { Component } from 'react';
import styled from 'styled-components';

const Header = styled(Typography)`
  color: ${({ theme }) => theme.colors.primary1};
`;

/**
 * This catches all errors in the UI at the sign tx level. Essentially this is a catch all if the sign tx render boundary fails to catch the issue then this should do it
 */
export class SignTxRenderErrorBoundary extends Component<
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
        <VerticalFlex width={'100%'} align="center" padding={'80px 0 0 0'}>
          <Header size={18}>Render Error</Header>
          <SubTextTypography margin={'8px 0'} align="center">
            Something went wrong while attempting to show the info for this
            transaction. Please copy the below error and post it in our discord,
            telegram or one of our social channels so our developers can address
            it as soon as possible. We apologize for the inconvenience.
          </SubTextTypography>
          <Card margin={'20px 0 8px 0'} padding={'24px 24px 0 24px'}>
            <VerticalFlex>
              <Typography
                wordBreak={'break-word'}
                style={{ maxHeight: '125px', overflow: 'auto' }}
              >
                {this.state.errorStack}
              </Typography>

              <HorizontalFlex justify={'center'}>
                <TextButton
                  onClick={() => {
                    navigator.clipboard.writeText(this.state.errorStack ?? '');
                    toast.success('Copied');
                  }}
                  style={{ height: '40px' }}
                >
                  <CopyIcon color={'white'} />
                </TextButton>
              </HorizontalFlex>
            </VerticalFlex>
          </Card>
          <SubTextTypography
            margin={'8px 0'}
            align="center"
            padding={'80px 0 0 0'}
          >
            Despite this error you can still perform your transaction as
            expected.
          </SubTextTypography>
        </VerticalFlex>
      );
    }

    return this.props.children;
  }
}
