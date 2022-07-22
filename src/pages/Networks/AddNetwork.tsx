import { useRef, useState } from 'react';
import {
  VerticalFlex,
  PrimaryButton,
  ComponentSize,
  HorizontalFlex,
  toast,
  CustomToast,
  Typography,
} from '@avalabs/react-components';
import { PageTitle } from '@src/components/common/PageTitle';
import { NetworkForm, NetworkFormAction } from './NetworkForm';
import {
  Scrollbars,
  ScrollbarsRef,
} from '@src/components/common/scrollbars/Scrollbars';
import styled, { useTheme } from 'styled-components';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useHistory } from 'react-router-dom';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

const FlexScrollbars = styled(Scrollbars)`
  flex-grow: 1;
  max-height: unset;
  height: 100%;
  width: 100%;

  & > div {
    display: flex;
    flex-direction: column;
  }
`;

export const AddNetwork = () => {
  const { saveCustomNetwork } = useNetworkContext();
  const history = useHistory();
  const theme = useTheme();
  const [network, setNetwork] = useState<Network>({
    chainName: '',
    chainId: 0,
    vmName: NetworkVMType.EVM,
    rpcUrl: '',
    networkToken: {
      name: '',
      symbol: '',
      description: '',
      decimals: 18,
      logoUri: '',
    },
    logoUri: '',
    explorerUrl: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollbarRef = useRef<ScrollbarsRef | null>(null);
  const { capture } = useAnalyticsContext();

  const onSuccess = () => {
    capture('CustomNetworkAdded');
    toast.custom(<CustomToast label="Custom network added!" />);
    history.push('/networks?activeTab=NETWORKS');
  };

  const onError = (e: string) => {
    setErrorMessage(e);
    scrollbarRef?.current?.scrollToTop();
  };

  const handleSave = () => {
    saveCustomNetwork(network)
      .then(() => {
        onSuccess();
      })
      .catch((e) => onError(e));
  };

  const handleChange = (network: Network, formValid: boolean) => {
    setNetwork({
      ...network,
    });
    setIsFormValid(formValid);
  };

  return (
    <VerticalFlex width="100%">
      <HorizontalFlex marginBottom="12px">
        <PageTitle>Add Network</PageTitle>
      </HorizontalFlex>
      <FlexScrollbars ref={scrollbarRef}>
        <VerticalFlex padding="0 16px">
          {errorMessage && (
            <Typography
              color={theme.colors.error}
              size={14}
              padding="8px 0"
              margin="0 0 16px 0"
            >
              {errorMessage}
            </Typography>
          )}
          <NetworkForm
            customNetwork={network}
            handleChange={handleChange}
            showErrors={showErrors}
            action={NetworkFormAction.Add}
          />
        </VerticalFlex>
      </FlexScrollbars>
      <VerticalFlex
        align="center"
        grow="1"
        justify="flex-end"
        margin="24px 16px"
      >
        <PrimaryButton
          size={ComponentSize.LARGE}
          width="100%"
          onClick={async () => {
            setShowErrors(true);
            if (isFormValid) {
              handleSave();
            }
          }}
        >
          Save
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
};
