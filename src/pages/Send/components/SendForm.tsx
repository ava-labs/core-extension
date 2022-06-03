import { useState } from 'react';
import { TokenSelect } from '@src/components/common/TokenSelect';
import { ContactInput } from './ContactInput';
import { Contact } from '@src/background/services/contacts/models';
import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TransactionFeeTooltip } from '@src/components/common/TransactionFeeTooltip';
import { BigNumber } from 'ethers';
import { CustomFees, GasFeeModifier } from '@src/components/common/CustomFees';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { TokenWithBalance } from '@src/background/services/balances/models';
import BN from 'bn.js';
import { SendState } from '@src/background/services/send/models';

const FALLBACK_MAX = new BN(0);

type SendFormProps = {
  sendState: SendState;
  contactInput?: Contact;
  onContactChange(contact?: Contact, selectedTab?: string): void;
  selectedToken: TokenWithBalance | undefined;
  onTokenChange(token: TokenWithBalance): void;
  amountInput?: BN;
  onAmountInputChange({ amount: string, bn: BN }): void;
  tokensWBalances: TokenWithBalance[];
  onGasChanged(
    gasLimit: number,
    gasPrice: BigNumber,
    feeType: GasFeeModifier
  ): void;
  maxGasPrice?: string;
  gasPrice?: BigNumber;
  selectedGasFee?: GasFeeModifier;
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
}: SendFormProps) => {
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const { networkFee } = useNetworkFeeContext();

  const toggleContactsDropdown = (to?: boolean) => {
    setIsContactsOpen(to === undefined ? !isContactsOpen : to);
    setIsTokenSelectOpen(false);
  };

  const toggleTokenDropdown = () => {
    setIsTokenSelectOpen(!isTokenSelectOpen);
    setIsContactsOpen(false);
  };

  return (
    <>
      <ContactInput
        contact={contactInput}
        onChange={onContactChange}
        isContactsOpen={isContactsOpen}
        toggleContactsDropdown={toggleContactsDropdown}
        setIsOpen={setIsContactsOpen}
      />
      <HorizontalFlex padding="0 16px" width="100%">
        <TokenSelect
          maxAmount={sendState.maxAmount || FALLBACK_MAX}
          tokensList={tokensWBalances}
          selectedToken={selectedToken}
          onTokenChange={onTokenChange}
          inputAmount={amountInput}
          onInputAmountChange={onAmountInputChange}
          onSelectToggle={toggleTokenDropdown}
          isOpen={isTokenSelectOpen}
          isValueLoading={sendState.loading}
          error={sendState.error?.message}
          margin="24px 0"
          setIsOpen={setIsTokenSelectOpen}
        />
      </HorizontalFlex>
      <VerticalFlex width="100%" padding="0 16px">
        <HorizontalFlex margin="16px 0 8px" width="100%" align="center">
          <Typography size={12} height="15px" margin="0 8px 0 0">
            Network Fee
          </Typography>
          <TransactionFeeTooltip
            gasPrice={BigNumber.from(sendState?.gasPrice?.toString() || 0)}
            gasLimit={sendState?.gasLimit}
          />
        </HorizontalFlex>
        <VerticalFlex width="100%">
          <CustomFees
            gasPrice={gasPrice || networkFee?.low || BigNumber.from(0)}
            limit={sendState?.gasLimit || 0}
            onChange={onGasChanged}
            maxGasPrice={maxGasPrice}
            selectedGasFeeModifier={selectedGasFee}
          />
        </VerticalFlex>
      </VerticalFlex>
    </>
  );
};
