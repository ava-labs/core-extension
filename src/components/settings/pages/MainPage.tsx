import {
  CaretIcon,
  CloseIcon,
  ComponentSize,
  DropDownMenuItem,
  HorizontalFlex,
  HorizontalSeparator,
  IconDirection,
  SecondaryButton,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SettingsPageProps, SettingsPages } from '../models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { Logo } from '@src/components/icons/Logo';
import { BrandName } from '@src/components/icons/BrandName';
import { BetaLabel } from '@src/components/icons/BetaLabel';
import { WalletType } from '@src/background/services/wallet/models';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@src/hooks/useLanguages';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import styled from 'styled-components';
import { getCoreWebUrl } from '@src/utils/getCoreWebUrl';

const StyledTag = styled(Typography)`
  background-color: ${({ theme }) => theme.palette.secondary[500]};
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  padding: 2px 8px;
`;

export function MainPage({ navigateTo, width, onClose }: SettingsPageProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { walletType } = useWalletContext();
  const { lockWallet, currency } = useSettingsContext();
  const { currentLanguage } = useLanguage();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return (
    <VerticalFlex
      width={width}
      height="100%"
      padding="16px 0 24px"
      background={theme.colors.bg2}
    >
      <HorizontalFlex
        margin="0 0 16px"
        padding="0 16px"
        height="53px"
        justify="space-between"
        align="center"
      >
        <HorizontalFlex align="center">
          <Logo height={29} />
          <BrandName height={15} margin="0 0 0 8px" />
          <HorizontalFlex width="auto" margin="0 0 0 16px">
            <BetaLabel />
          </HorizontalFlex>
        </HorizontalFlex>
        <TextButton data-testid="close-settings-menu-button" onClick={onClose}>
          <CloseIcon height="16px" color={theme.colors.icon1} />
        </TextButton>
      </HorizontalFlex>
      <HorizontalFlex
        justify="space-between"
        padding="10px 16px"
        align="center"
      >
        <TextButton
          as="a"
          target="_blank"
          href={getCoreWebUrl(activeAccount?.addressC)}
          data-testid="core-web-link-button"
        >
          <Typography
            height="20px"
            size={14}
            color={theme.colors.secondary1}
            weight={600}
          >
            {t('Core Web')}
          </Typography>
        </TextButton>
        <StyledTag>{t('New!')}</StyledTag>
      </HorizontalFlex>
      <DropDownMenuItem
        data-testid="address-book-option"
        justify="space-between"
        align="center"
        padding="10px 16px"
        onClick={() => navigateTo(SettingsPages.CONTACT_LIST)}
      >
        <Typography size={14} height="17px">
          {t('Address Book')}
        </Typography>
        <CaretIcon
          color={theme.colors.icon1}
          height="14px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem
        data-testid="currency-option"
        justify="space-between"
        align="center"
        padding="10px 16px"
        onClick={() => navigateTo(SettingsPages.CURRENCIES)}
      >
        <Typography size={14} height="17px">
          {t('Currency')}
        </Typography>
        <HorizontalFlex align="center">
          <Typography
            size={14}
            height="17px"
            margin="0 8px"
            color={theme.colors.text2}
          >
            {currency}
          </Typography>
          <CaretIcon
            color={theme.colors.icon1}
            height="14px"
            direction={IconDirection.RIGHT}
          />
        </HorizontalFlex>
      </DropDownMenuItem>
      <DropDownMenuItem
        data-testid="language-option"
        justify="space-between"
        align="center"
        padding="10px 16px"
        onClick={() => navigateTo(SettingsPages.LANGUAGE)}
      >
        <Typography size={14} height="17px">
          {t('Language')}
        </Typography>
        <HorizontalFlex align="center">
          <Typography
            size={14}
            height="17px"
            margin="0 8px"
            color={theme.colors.text2}
          >
            {currentLanguage?.name}
          </Typography>
          <CaretIcon
            color={theme.colors.icon1}
            height="14px"
            direction={IconDirection.RIGHT}
          />
        </HorizontalFlex>
      </DropDownMenuItem>
      <DropDownMenuItem
        data-testid="advanced-option"
        justify="space-between"
        align="center"
        padding="10px 16px"
        onClick={() => navigateTo(SettingsPages.ADVANCED)}
      >
        <Typography size={14} height="17px">
          {t('Advanced')}
        </Typography>
        <HorizontalFlex align="center">
          <Typography
            size={14}
            height="17px"
            margin="0 8px"
            color={theme.colors.text2}
          ></Typography>
          <CaretIcon
            color={theme.colors.icon1}
            height="14px"
            direction={IconDirection.RIGHT}
          />
        </HorizontalFlex>
      </DropDownMenuItem>
      {walletType === WalletType.LEDGER && (
        <DropDownMenuItem
          justify="space-between"
          align="center"
          padding="10px 16px"
          onClick={() => navigateTo(SettingsPages.LEDGER)}
        >
          <Typography size={14} height="17px">
            {t('Ledger')}
          </Typography>
          <CaretIcon
            color={theme.colors.icon1}
            height="14px"
            direction={IconDirection.RIGHT}
          />
        </DropDownMenuItem>
      )}

      <HorizontalFlex width="100%" margin="16px 0" padding="0 16px">
        <HorizontalSeparator />
      </HorizontalFlex>

      <DropDownMenuItem
        data-testid="security-privacy-option"
        justify="space-between"
        align="center"
        padding="10px 16px"
        onClick={() => navigateTo(SettingsPages.SECURITY_AND_PRIVACY)}
      >
        <Typography size={14} height="17px">
          {t('Security & Privacy')}
        </Typography>
        <CaretIcon
          color={theme.colors.icon1}
          height="14px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>
      <DropDownMenuItem
        data-testid="legal-option"
        justify="space-between"
        align="center"
        padding="10px 16px"
        as="a"
        target="_blank"
        onClick={() => navigateTo(SettingsPages.LEGAL)}
      >
        <Typography size={14} height="17px">
          {t('Legal')}
        </Typography>
        <CaretIcon
          color={theme.colors.icon1}
          height="14px"
          direction={IconDirection.RIGHT}
        />
      </DropDownMenuItem>

      <DropDownMenuItem
        data-testid="help-center-option"
        justify="space-between"
        align="center"
        padding="10px 16px"
        as="a"
        target="_blank"
        onClick={() =>
          window.open(
            `https://support.avax.network/${
              currentLanguage ? currentLanguage.linkCode : 'en'
            }/collections/3391518-core`,
            '_blank'
          )
        }
      >
        <Typography size={14} height="17px">
          {t('Help Center')}
        </Typography>
      </DropDownMenuItem>

      <VerticalFlex grow="1" justify="flex-end" align="center" padding="0 16px">
        <SecondaryButton
          data-testid="lock-core-wallet-button"
          width="100%"
          size={ComponentSize.LARGE}
          onClick={lockWallet}
        >
          {t('Lock Core')}
        </SecondaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
