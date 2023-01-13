import {
  VerticalFlex,
  HorizontalFlex,
  DropDownMenuItem,
  Typography,
  DropDownMenu,
  IconDirection,
  CaretIcon,
  CheckmarkIcon,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { DerivationPath } from '@avalabs/wallets-sdk';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';

const StyledVerticalFlex = styled(VerticalFlex)`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.bg3};
  padding-bottom: 16px;
`;

const StyledHorizontalFlex = styled(HorizontalFlex)`
  width: 343px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.bg3};
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text2};
  margin-bottom: 16px;
`;

const StyledDropDownMenuItem = styled(DropDownMenuItem)<{
  selected?: boolean;
}>`
  justify-content: space-between;
  padding: 16px;
  width: 100%;
  background-color: ${({ selected }) => (selected ? '#262626' : 'inherit')};
  &:hover {
    background-color: #262626;
  }
`;

interface DerivationPathDropdownProps {
  setPathSpec: Dispatch<SetStateAction<DerivationPath>>;
  onPathSelected: (path: DerivationPath) => void;
  pathSpec: DerivationPath;
}

export function DerivationPathDropdown({
  pathSpec,
  onPathSelected,
}: DerivationPathDropdownProps) {
  const [selectingPath, setSelectingPath] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <StyledVerticalFlex>
        <Typography size={12} color={theme.inputs.colorLabel}>
          {t('Select Derivation Path')}
        </Typography>
        <DropDownMenu
          onMenuToggle={(val) => setSelectingPath(!val)}
          icon={
            <StyledHorizontalFlex>
              {!pathSpec && (
                <Typography color={theme.colors.text1} weight={400}>
                  {t('Select path')}
                </Typography>
              )}
              {pathSpec && pathSpec === DerivationPath.LedgerLive && (
                <Typography color={theme.colors.text1} weight={400}>
                  Ledger Live{' '}
                  <Typography color={theme.colors.text2}>
                    {t('(Default)')}
                  </Typography>
                </Typography>
              )}

              {pathSpec && pathSpec === DerivationPath.BIP44 && (
                <Typography>BIP44</Typography>
              )}
              <CaretIcon
                height={'12px'}
                color={theme.colors.text1}
                direction={
                  selectingPath ? IconDirection.DOWN : IconDirection.UP
                }
              />
            </StyledHorizontalFlex>
          }
        >
          <VerticalFlex width="343px">
            <StyledDropDownMenuItem
              selected={pathSpec === DerivationPath.LedgerLive}
              onClick={() => {
                onPathSelected(DerivationPath.LedgerLive);
              }}
            >
              <HorizontalFlex justify="space-between" width="100%">
                <Typography color={theme.colors.text1} weight={400}>
                  Ledger Live{' '}
                  <Typography color={theme.colors.text2}>
                    {t('(Default)')}
                  </Typography>
                </Typography>
                {pathSpec === DerivationPath.LedgerLive && (
                  <CheckmarkIcon height={'16px'} color={theme.colors.text1} />
                )}
              </HorizontalFlex>
            </StyledDropDownMenuItem>
            <StyledDropDownMenuItem
              selected={pathSpec === DerivationPath.BIP44}
              onClick={() => {
                onPathSelected(DerivationPath.BIP44);
              }}
            >
              <Typography>{t('BIP44')}</Typography>
              {pathSpec === DerivationPath.BIP44 && (
                <CheckmarkIcon height={'16px'} color={theme.colors.text1} />
              )}
            </StyledDropDownMenuItem>
          </VerticalFlex>
        </DropDownMenu>
      </StyledVerticalFlex>
    </>
  );
}
