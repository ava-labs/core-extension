import { Component } from 'react';
import {
  Button,
  Card,
  CardContent,
  Scrollbars,
  Stack,
  Typography,
  toast,
} from '@avalabs/core-k2-components';
import { WithTranslation, withTranslation } from 'react-i18next';

interface SignTxErrorBoundaryProps extends WithTranslation {
  variant?: 'RenderError' | 'OpenError';
}

/**
 * This catches all errors in the UI at the sign tx level. Essentially this is a catch all if the sign tx render boundary fails to catch the issue then this should do it
 */
class RawSignTxErrorBoundary extends Component<
  SignTxErrorBoundaryProps,
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
        <Stack
          sx={{
            width: 1,
            alignItems: 'center',
            px: 2,
            pb: 1,
            gap: 1,
            flexGrow: 1,
          }}
        >
          <Typography variant="h5" color="error.main">
            {this.getHeader()}
          </Typography>
          <Typography variant="body2" align="center">
            {this.getDescription()}
          </Typography>
          <Typography variant="body2" align="center">
            {this.props.t(
              'Please copy the below error and post it in our discord, telegram or one of our social channels so our developers can address it as soon as possible. We apologize for the inconvenience.'
            )}
          </Typography>
          <Card sx={{ mt: 2, width: 1, height: 340 }}>
            <CardContent sx={{ p: 2, height: 1 }}>
              <Scrollbars>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ wordBreak: 'break-word' }}
                >
                  {this.state.errorStack}
                </Typography>
              </Scrollbars>
            </CardContent>
          </Card>
          <Stack
            direction="row"
            sx={{
              width: 1,
              flexGrow: 1,
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Button
              color="secondary"
              size="large"
              fullWidth
              onClick={window.close}
            >
              {this.props.t('Close')}
            </Button>
            <Button
              color="primary"
              size="large"
              fullWidth
              onClick={() => {
                navigator.clipboard.writeText(this.state.errorStack ?? '');
                toast.success(this.props.t('Copied!'), {
                  duration: 2000,
                });
              }}
            >
              {this.props.t('Copy')}
            </Button>
          </Stack>
        </Stack>
      );
    }

    return this.props.children;
  }

  private getHeader() {
    switch (this.props.variant) {
      case 'RenderError':
        return this.props.t('Render Error');

      default:
        return this.props.t('Error');
    }
  }

  private getDescription() {
    switch (this.props.variant) {
      case 'RenderError':
        return this.props.t(
          'Something went wrong while attempting to show the info for this transaction.'
        );

      default:
        return this.props.t(
          'Something went wrong while opening the approval window for this transaction.'
        );
    }
  }
}

// Export the component class with translation props pre-set.
export const SignTxErrorBoundary = withTranslation()(RawSignTxErrorBoundary);
