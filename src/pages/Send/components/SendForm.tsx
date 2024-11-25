import { PropsWithChildren, useMemo, useRef, useState } from 'react';
import {
  Typography,
  Button,
  Stack,
  Scrollbars,
  Tooltip,
} from '@avalabs/core-k2-components';
import { Contact } from '@avalabs/types';
import { useTranslation } from 'react-i18next';

import { TokenSelect } from '@src/components/common/TokenSelect';
import { SendErrorMessage } from '@src/utils/send/models';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useSendAnalyticsData } from '@src/hooks/useSendAnalyticsData';

import { ContactInput } from './ContactInput';
import { useIdentifyAddress } from '../hooks/useIdentifyAddress';
import { getSendErrorMessage } from '../utils/sendErrorMessages';
import { TokenWithBalance } from '@avalabs/vm-module-types';

type SendFormProps = {
  address?: string;
  inputAmount?: bigint;
  tokenList: TokenWithBalance[];
  token?: TokenWithBalance;
  isValid: boolean;
  isValidating: boolean;
  isSending: boolean;
  maxAmount: string;
  error?: SendErrorMessage;
  onAmountChanged(newAmount: string): void;
  onContactChanged(newContact?: Contact): void;
  onTokenChanged(newToken: TokenWithBalance): void;
  onSend(): void;
};

const generalErrors: string[] = [
  SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE,
  SendErrorMessage.EXCESSIVE_NETWORK_FEE,
  SendErrorMessage.INVALID_NETWORK_FEE,
  SendErrorMessage.UNABLE_TO_FETCH_UTXOS,
];

const errorsToExcludeForTokenSelect: string[] = [
  SendErrorMessage.ADDRESS_REQUIRED,
  SendErrorMessage.INVALID_ADDRESS,
  ...generalErrors,
];

export const SendForm = ({
  address,
  inputAmount,
  token,
  isValid,
  isValidating,
  isSending,
  maxAmount,
  error,
  onAmountChanged,
  onContactChanged,
  onTokenChanged,
  onSend,
  tokenList,
  children,
}: PropsWithChildren<SendFormProps>) => {
  const { t } = useTranslation();
  const identifyAddress = useIdentifyAddress();
  const contact = useMemo(
    () => (address ? identifyAddress(address) : undefined),
    [address, identifyAddress]
  );
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);

  const { capture } = useAnalyticsContext();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();

  const formRef = useRef<HTMLDivElement>(null);

  return (
    <Stack sx={{ flexGrow: 1, alignItems: 'center', width: '100%', pt: 1 }}>
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <Stack ref={formRef}>
          <ContactInput
            contact={contact}
            onChange={(newContact, tab) => {
              onContactChanged(newContact);
              capture('SendContactSelected', { contactSource: tab });
            }}
            isContactsOpen={isContactsOpen}
            setIsOpen={(open) => setIsContactsOpen(open)}
            containerRef={formRef}
          />
          <Stack
            sx={{
              pl: 2,
              mt: 0.5,
              width: '100%',
              height: 2,
            }}
          >
            {(error === SendErrorMessage.ADDRESS_REQUIRED ||
              error === SendErrorMessage.INVALID_ADDRESS) && (
              <Typography
                variant="caption"
                sx={{ color: (theme) => theme.palette.error.main }}
              >
                {getSendErrorMessage(error)}
              </Typography>
            )}
          </Stack>

          <Stack sx={{ py: 0, px: 2, mt: 4, width: '100%' }}>
            <TokenSelect
              maxAmount={maxAmount ? BigInt(maxAmount) : undefined}
              tokensList={tokenList}
              selectedToken={token}
              onTokenChange={(newToken) => {
                onTokenChanged(newToken as TokenWithBalance);
                sendTokenSelectedAnalytics('Send');
              }}
              inputAmount={inputAmount}
              onInputAmountChange={({ amount: newAmount }) => {
                onAmountChanged(newAmount);
                sendAmountEnteredAnalytics('Send');
              }}
              onSelectToggle={() => {
                setIsTokenSelectOpen((open) => !open);
              }}
              isOpen={isTokenSelectOpen}
              error={
                error &&
                (errorsToExcludeForTokenSelect.includes(error)
                  ? undefined
                  : getSendErrorMessage(error))
              }
              setIsOpen={(open) => setIsTokenSelectOpen(open)}
            />
          </Stack>
          {children}
          {error && generalErrors.includes(error) && (
            <Stack sx={{ py: 0, px: 2, mt: 2, width: '100%' }}>
              <Typography variant="caption" color="error.main">
                {getSendErrorMessage(error)}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Scrollbars>
      {!isContactsOpen && !isTokenSelectOpen && (
        <Stack
          sx={{
            flexGrow: 1,
            justifyContent: 'flex-end',
            pt: 3,
            px: 2,
            pb: 3,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Tooltip
            placement="top"
            sx={{ width: '100%' }}
            title={
              error ? (
                <Typography variant="body2">
                  {getSendErrorMessage(error)}
                </Typography>
              ) : (
                ''
              )
            }
          >
            <Button
              data-testid="send-next-button"
              variant="contained"
              size="large"
              onClick={onSend}
              disabled={isValidating || !isValid || isSending}
              isLoading={isSending}
              fullWidth
            >
              {t('Next')}
            </Button>
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );
};
