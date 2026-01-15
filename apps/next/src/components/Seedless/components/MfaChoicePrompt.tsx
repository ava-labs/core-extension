import {
  Box,
  ChevronRightIcon,
  List,
  ListItemText,
  ListItemTextProps,
} from '@avalabs/k2-alpine';
import {
  MfaChoiceRequest,
  RecoveryMethod as RecoveryMethodT,
  PartialBy,
} from '@core/types';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react';
import { Page } from '@/components/Page';
import { getIconForMethod } from '@/pages/Settings/components/RecoveryMethods/utils';
import { useSeedlessMfaManager } from '@core/ui';
import { useRecoveryMethodsData } from '../hooks/useRecoveryMethodsData';
import {
  StyledDivider,
  StyledListItemButton,
  StyledListItemEndIcon,
  StyledListItemStartIcon,
  StyledPaper,
} from '../styled';

type Props = {
  mfaChoice?: PartialBy<MfaChoiceRequest, 'mfaId'>;
  onChosen: (method: RecoveryMethodT) => void;
};

const optionSlotProps: ListItemTextProps['slotProps'] = {
  primary: {
    variant: 'subtitle3',
  },
  secondary: {
    variant: 'caption2',
  },
};

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

const getMethodType = (method: RecoveryMethodT) => {
  if (method.type === 'totp') {
    return 'authenticator';
  }
  if (method.aaguid === EMPTY_GUID) {
    return 'yubikey';
  }
  return 'passkey';
};

export const MfaChoicePrompt = ({ mfaChoice, onChosen }: Props) => {
  const { t } = useTranslation();
  const { hasMfaConfigured, hasTotpConfigured } = useSeedlessMfaManager();

  const { recoveryMethodCards } = useRecoveryMethodsData({
    hasTotpConfigured,
    hasMfaConfigured,
  });

  return (
    <Page
      title={t('Choose Verification Method')}
      withBackButton={false}
      contentProps={{
        justifyContent: 'flex-start',
        mt: 4.5,
      }}
    >
      {mfaChoice?.availableMethods?.length && (
        <StyledPaper elevation={0}>
          <Box marginBlock="auto">
            <List disablePadding>
              {mfaChoice?.availableMethods?.map((method, index) => {
                const methodType = getMethodType(method);
                const recoveryMethodCard = recoveryMethodCards.find(
                  (card) => card.method === methodType,
                );

                return (
                  <Fragment key={method.type}>
                    <StyledListItemButton onClick={() => onChosen(method)}>
                      <StyledListItemStartIcon>
                        {getIconForMethod(method)}
                      </StyledListItemStartIcon>
                      <ListItemText
                        sx={{ py: 1.5 }}
                        primary={recoveryMethodCard?.title}
                        secondary={recoveryMethodCard?.description}
                        slotProps={optionSlotProps}
                      />
                      <StyledListItemEndIcon>
                        <ChevronRightIcon size={22} />
                      </StyledListItemEndIcon>
                    </StyledListItemButton>
                    {index < mfaChoice.availableMethods.length - 1 && (
                      <StyledDivider variant="inset" />
                    )}
                  </Fragment>
                );
              })}
            </List>
          </Box>
        </StyledPaper>
      )}
    </Page>
  );
};
