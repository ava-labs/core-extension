import { useEffect, useState } from 'react';
import { TokenSelect } from '@src/components/common/TokenSelect';
import { ContactInput } from './ContactInput';
import type { Contact } from '@avalabs/types';
import { BigNumber } from 'ethers';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { TokenWithBalance } from '@src/background/services/balances/models';
import BN from 'bn.js';
import {
  SendErrorMessage,
  SendState,
} from '@src/background/services/send/models';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getSendErrorMessage } from '@src/pages/Send/utils/sendErrorMessages';
import { CustomFees, GasFeeModifier } from '@src/components/common/CustomFees';
import { Stack, Typography } from '@avalabs/k2-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

const FALLBACK_MAX = new BN(0);

type SendFormProps = {
  sendState: SendState;
  contactInput?: Contact;
  onContactChange(contact?: Contact, selectedTab?: string): void;
  selectedToken: TokenWithBalance | undefined;
  onTokenChange(token: TokenWithBalance): void;
  amountInput?: BN;
  onAmountInputChange(data: { amount: string; bn: BN }): void;
  tokensWBalances: TokenWithBalance[];
  onGasChanged(values: {
    customGasLimit?: number;
    maxFeePerGas: BigNumber;
    maxPriorityFeePerGas?: BigNumber;
    feeType: GasFeeModifier;
  }): void;
  maxGasPrice?: string;
  gasPrice?: BigNumber;
  selectedGasFee?: GasFeeModifier;
  onAddressBookToggled: (visible: boolean) => void;
  onTokenSelectToggled: (visible: boolean) => void;
};

export const SendForm = ({
  sendState,
  contactInput,
  onContactChange,
  selectedToken,
  onTokenChange,
  amountInput,
  onAmountInputChange,
  tokensWBalances,
  onGasChanged,
  maxGasPrice,
  gasPrice,
  selectedGasFee,
  onAddressBookToggled,
  onTokenSelectToggled,
}: SendFormProps) => {
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const { networkFee } = useNetworkFeeContext();
  const { network } = useNetworkContext();
  const { capture } = useAnalyticsContext();

  const setContactsDropDownOpen = (open: boolean) => {
    setIsContactsOpen(open);
    onAddressBookToggled(open);
  };

  const setTokensDropDownOpen = (open: boolean) => {
    setIsTokenSelectOpen(open);
    onTokenSelectToggled(open);
  };

  useEffect(() => {
    onTokenSelectToggled(isTokenSelectOpen);
  }, [isTokenSelectOpen, onTokenSelectToggled]);

  const errorsToExcludeForTokenSelect: string[] = [
    SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE,
    SendErrorMessage.ADDRESS_REQUIRED,
    SendErrorMessage.INVALID_ADDRESS,
  ];

  const toggleTokenDropdown = () => {
    setTokensDropDownOpen(!isTokenSelectOpen);
    setContactsDropDownOpen(false);
  };

  return (
    <>
      <ContactInput
        contact={contactInput}
        onChange={onContactChange}
        isContactsOpen={isContactsOpen}
        setIsOpen={(open) => setContactsDropDownOpen(open)}
      />
      <Stack
        sx={{
          pl: 2,
          mt: 0.5,
          width: '100%',
          height: 2,
        }}
      >
        {(sendState?.error?.message === SendErrorMessage.ADDRESS_REQUIRED ||
          sendState?.error?.message === SendErrorMessage.INVALID_ADDRESS) && (
          <Typography
            variant="caption"
            sx={{ color: (theme) => theme.palette.error.main }}
          >
            {getSendErrorMessage(sendState.error?.message as SendErrorMessage)}
          </Typography>
        )}
      </Stack>

      <Stack sx={{ py: 0, px: 2, mt: 4, width: '100%' }}>
        <TokenSelect
          maxAmount={sendState.maxAmount || FALLBACK_MAX}
          tokensList={tokensWBalances}
          selectedToken={selectedToken}
          onTokenChange={onTokenChange}
          inputAmount={amountInput}
          onInputAmountChange={onAmountInputChange}
          onSelectToggle={toggleTokenDropdown}
          isOpen={isTokenSelectOpen}
          isValueLoading={selectedToken ? sendState.loading : false}
          error={
            !selectedToken
              ? undefined
              : sendState.error?.message &&
                errorsToExcludeForTokenSelect.includes(sendState.error.message)
              ? undefined
              : getSendErrorMessage(
                  sendState.error?.message as SendErrorMessage
                )
          }
          setIsOpen={(open) => setTokensDropDownOpen(open)}
        />
      </Stack>
      <Stack
        data-testid="send-custom-fees-section"
        sx={{
          mb: 3,
          flexDirection: 'row',
          p: 2,
          width: '100%',
          display: isContactsOpen ? 'none' : 'flex',
        }}
      >
        <CustomFees
          maxFeePerGas={gasPrice || networkFee?.low.maxFee || BigNumber.from(0)}
          limit={sendState.customGasLimit || sendState.gasLimit || 0}
          onChange={onGasChanged}
          onModifierChangeCallback={(modifier: GasFeeModifier | undefined) => {
            capture('SendFeeOptionChanged', { modifier });
          }}
          maxGasPrice={maxGasPrice}
          selectedGasFeeModifier={selectedGasFee}
          network={network}
          networkFee={networkFee}
        />
      </Stack>
    </>
  );
};
