import { FC } from 'react';
import { TruncatedText } from '../../styledComponents';
import { AccountSectionContainer, Label } from '../styled';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

type Props = {
  setIsAccountHovered: (isHovered: boolean) => void;
  accountTextRef: React.RefObject<HTMLSpanElement | null>;
  isAccountTruncated: boolean;
  accountName: string;
  isContainerHovered: boolean;
};

export const AccountSection: FC<Props> = ({
  setIsAccountHovered,
  accountTextRef,
  isAccountTruncated,
  accountName,
  isContainerHovered,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const navigateToPortfolio = () => history.push(`/portfolio`);
  return (
    <AccountSectionContainer
      shouldShift={false}
      onClick={navigateToPortfolio}
      onMouseEnter={() => setIsAccountHovered(true)}
      onMouseLeave={() => setIsAccountHovered(false)}
    >
      <TruncatedText
        ref={accountTextRef}
        variant="subtitle3"
        showFade={isAccountTruncated}
      >
        {accountName}
      </TruncatedText>
      {isContainerHovered && <Label variant="caption">{t('Account')}</Label>}
    </AccountSectionContainer>
  );
};
