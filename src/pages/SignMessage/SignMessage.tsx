import {
  Card,
  ComponentSize,
  GlobeIcon,
  HorizontalFlex,
  LoadingSpinnerIcon,
  PrimaryButton,
  SecondaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { ActionStatus } from '@src/background/services/actions/models';
import { MessageType } from '@src/background/services/messages/models';
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import { TokenIcon } from '@src/components/common/TokenImage';
import Scrollbars from 'react-custom-scrollbars-2';
import { useTheme } from 'styled-components';
import { useApproveAction } from '../../hooks/useApproveAction';
import { useGetRequestId } from '../../hooks/useGetRequestId';
import { SignTxRenderErrorBoundary } from '../SignTransaction/components/SignTxRenderErrorBoundary';
import { EthSign } from './components/EthSign';
import { PersonalSign } from './components/PersonalSign';
import { SignData } from './components/SignData';
import { SignDataV3 } from './components/SignDataV3';
import { SignDataV4 } from './components/SignDataV4';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

export function SignMessage() {
  const theme = useTheme();
  const requestId = useGetRequestId();
  const { action: message, updateAction: updateMessage } =
    useApproveAction(requestId);

  if (!message) {
    return (
      <HorizontalFlex
        width={'100%'}
        height={'100%'}
        justify={'center'}
        align={'center'}
      >
        <LoadingSpinnerIcon color={theme.colors.icon1} />
      </HorizontalFlex>
    );
  }

  return (
    <>
      <VerticalFlex width="100%" padding="0 16px" align="center">
        <SignTxRenderErrorBoundary>
          <VerticalFlex padding="12px 0">
            <Typography as="h1" size={20} height="29px" weight={600}>
              {message.error ? t('Signing Failed') : t('Sign Message')}
            </Typography>
          </VerticalFlex>

          <VerticalFlex align="center" margin="0 0 24px">
            <SiteAvatar justify="center" align="center">
              <TokenIcon height="48px" width="48px" src={message.site?.icon}>
                <GlobeIcon
                  height="48px"
                  width="48px"
                  color={theme.colors.icon1}
                />
              </TokenIcon>
            </SiteAvatar>

            <Typography align="center" size={14} height="17px">
              <Trans
                i18nKey="{{domain}} requests you to <br />sign the following message"
                domain={message.site?.domain || 'A site'}
              />
            </Typography>
          </VerticalFlex>

          {/* Actions  */}
          {
            {
              [MessageType.ETH_SIGN]: <EthSign message={message} />,
              [MessageType.PERSONAL_SIGN]: <PersonalSign message={message} />,
              [MessageType.SIGN_TYPED_DATA]: <SignData message={message} />,
              [MessageType.SIGN_TYPED_DATA_V1]: <SignData message={message} />,
              [MessageType.SIGN_TYPED_DATA_V3]: (
                <SignDataV3 message={message} />
              ),
              [MessageType.SIGN_TYPED_DATA_V4]: (
                <SignDataV4 message={message} />
              ),
              ['unknown']: (
                <Typography color={theme.colors.error} size={14} margin="8px 0">
                  {t('Unknown sign type')}
                </Typography>
              ),
            }[message.method || 'unknown']
          }

          {message.error && (
            <VerticalFlex margin="16px 0 0 0" width={'100%'}>
              <Typography size={12} height="15px" margin="0 0 8px 0">
                {t('Error:')}
              </Typography>
              <Card height="105px" padding="16px 0">
                <Scrollbars
                  style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
                >
                  <VerticalFlex padding="0 16px">
                    <Typography size={12} height="17px" wordBreak="break-all">
                      {message.error}
                    </Typography>
                  </VerticalFlex>
                </Scrollbars>
              </Card>
            </VerticalFlex>
          )}

          {/* Action Buttons */}
          <HorizontalFlex
            flex={1}
            align="flex-end"
            width="100%"
            justify="space-between"
            padding="0 0 8px"
          >
            <SecondaryButton
              size={ComponentSize.LARGE}
              width="168px"
              onClick={() => {
                updateMessage({
                  status: ActionStatus.ERROR_USER_CANCELED,
                  id: message.id,
                });
                window.close();
              }}
            >
              {t('Reject')}
            </SecondaryButton>
            <PrimaryButton
              width="168px"
              size={ComponentSize.LARGE}
              onClick={() => {
                updateMessage({
                  status: ActionStatus.SUBMITTING,
                  id: message.id,
                });
              }}
            >
              {t('Sign')}
            </PrimaryButton>
          </HorizontalFlex>
        </SignTxRenderErrorBoundary>
      </VerticalFlex>
    </>
  );
}
