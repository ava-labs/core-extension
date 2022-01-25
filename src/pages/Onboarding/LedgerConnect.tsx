import { useCallback, useEffect, useState } from 'react';
import {
  VerticalFlex,
  Typography,
  TextButton,
  HorizontalFlex,
  CaretIcon,
  IconDirection,
  CloseIcon,
  InfoIcon,
  Tooltip,
  PrimaryButton,
  ComponentSize,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import {
  LedgerConnectCard,
  LedgerStatus,
} from './components/LedgerConnectCard';
import { useLedgerSupportContext } from '@src/contexts/LedgerSupportProvider';

interface LedgerConnectProps {
  onCancel(): void;
  onBack(): void;
  onNext(): void;
  onError(): void;
}

const StyledTooltip = styled(Tooltip)`
  display: inline;
  padding: 0 0 0 8px;
  vertical-align: text-top;
  cursor: pointer;
`;

/**
 * Waiting this amount of time otherwise this screen would be a blip and the user wouldnt even know it happened
 */
const WAIT_1500_MILLI_FOR_USER = 1500;

export function LedgerConnect({
  onBack,
  onCancel,
  onNext,
  onError,
}: LedgerConnectProps) {
  const theme = useTheme();
  const {
    getPublicKey,
    popDeviceSelection,
    hasLedgerTransport,
    initLedgerTransport,
  } = useLedgerSupportContext();
  const [publicKeyState, setPublicKeyState] = useState<LedgerStatus>(
    LedgerStatus.LEDGER_LOADING
  );

  const getPublicKeyAndRedirect = useCallback(
    () =>
      getPublicKey()
        .then((res) => {
          if (res) {
            setPublicKeyState(LedgerStatus.LEDGER_CONNECTED);
            setTimeout(() => {
              onNext();
            }, WAIT_1500_MILLI_FOR_USER);
          }
        })
        .catch(() => {
          setPublicKeyState(LedgerStatus.LEDGER_CONNECTION_FAILED);
        }),
    [getPublicKey, onNext]
  );

  useEffect(() => {
    initLedgerTransport()
      .then(() => {
        getPublicKeyAndRedirect();
      })
      .catch(() => {
        // unable to get transport, try device selection first
        popDeviceSelection()
          .then(() => {
            initLedgerTransport().then(() => {
              getPublicKeyAndRedirect();
            });
          })
          .catch(() => {
            // transport creation and device selection failed
            // need to retry
            setPublicKeyState(LedgerStatus.LEDGER_CONNECTION_FAILED);
          });
      });
    // only call this once when the component is initialized
    // extra calls can break the ledger flow
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tryPublicKey = async () => {
    setPublicKeyState(LedgerStatus.LEDGER_LOADING);

    if (!hasLedgerTransport) {
      // make sure we have a transport
      await initLedgerTransport();
    }

    return getPublicKeyAndRedirect();
  };

  const onLedgerCardClicked = () => {
    if (publicKeyState === LedgerStatus.LEDGER_CONNECTION_FAILED) {
      onError();
    }
  };

  const Content = (
    <Typography align="left" size={12}>
      This process retrieves the addresses from your ledger
    </Typography>
  );

  return (
    <VerticalFlex width="100%" align="center">
      <HorizontalFlex width="100%" justify="space-between" align="center">
        <TextButton onClick={onBack}>
          <CaretIcon
            direction={IconDirection.LEFT}
            height="18px"
            color={theme.colors.icon1}
          />
        </TextButton>
        <Typography as="h1" size={24} weight={700} height="29px">
          Connect your Ledger
        </Typography>
        <TextButton onClick={onCancel}>
          <CloseIcon height="18px" color={theme.colors.icon1} />
        </TextButton>
      </HorizontalFlex>
      <HorizontalFlex align="center" margin="8px 0 40px">
        <Typography align="center" height="24px">
          Please confirm these actions on
          <br />
          your Ledger device
          <StyledTooltip content={Content}>
            <InfoIcon height="16px" color={theme.colors.text2} />
          </StyledTooltip>
        </Typography>
      </HorizontalFlex>
      <VerticalFlex grow="1">
        <LedgerConnectCard
          path={"m/44'/60'/0'"}
          status={publicKeyState}
          onClick={onLedgerCardClicked}
        />
      </VerticalFlex>
      {publicKeyState === LedgerStatus.LEDGER_CONNECTION_FAILED && (
        <PrimaryButton
          onClick={() => tryPublicKey()}
          width="343px"
          margin="0 0 40px"
          size={ComponentSize.LARGE}
        >
          Retry
        </PrimaryButton>
      )}
    </VerticalFlex>
  );
}
