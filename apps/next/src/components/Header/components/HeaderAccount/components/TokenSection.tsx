import { FC } from 'react';
import { TruncatedText } from '../../styledComponents';
import { AccountSectionContainer, Label } from '../styled';
import { useTranslation } from 'react-i18next';

type Props = {
  tokenTextRef: React.RefObject<HTMLSpanElement | null>;
  isTokenTruncated: boolean;
  tokenName: string;
  isContainerHovered: boolean;
};

export const TokenSection: FC<Props> = ({
  tokenTextRef,
  isTokenTruncated,
  tokenName,
  isContainerHovered,
}) => {
  const { t } = useTranslation();

  return (
    <AccountSectionContainer shouldShift={false}>
      <TruncatedText
        ref={tokenTextRef}
        variant="subtitle3"
        showFade={isTokenTruncated}
      >
        {tokenName}
      </TruncatedText>
      {isContainerHovered && <Label variant="caption">{t('Token')}</Label>}
    </AccountSectionContainer>
  );
};
