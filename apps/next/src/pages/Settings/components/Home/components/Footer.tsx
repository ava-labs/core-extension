import {
  CoreIcon,
  Link,
  Stack,
  StackProps,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { useAnalyticsContext } from '@core/ui';
import { Trans, useTranslation } from 'react-i18next';
import { runtime } from 'webextension-polyfill';

import { InTextLink } from '@/components/InTextLink';
import { TextToCopy } from '@/components/TextToCopy';

export const Footer = (props: StackProps) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  return (
    <FooterContainer {...props}>
      <CoreIcon opacity={0.5} />
      <Stack>
        <Typography variant="caption" color="text.secondary">
          <Trans
            i18nKey="By using this application, you agree to the <br/> <termsLink>Terms of Use</termsLink> and <policyLink>Privacy Policy</policyLink>"
            components={{
              termsLink: (
                <InTextLink
                  sx={{ ml: 0.25 }}
                  target="_blank"
                  href="https://core.app/terms/core"
                  rel="noreferrer"
                  onClick={() => capture('TermsOfUseClicked')}
                />
              ),
              policyLink: (
                <InTextLink
                  sx={{ ml: 0.25 }}
                  target="_blank"
                  href="https://www.avalabs.org/privacy-policy"
                  rel="noreferrer"
                  onClick={() => capture('PrivacyPolicyClicked')}
                />
              ),
            }}
          />
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('© 2025 Ava Labs – All rights reserved.')}
        </Typography>

        <Link variant="caption" color="text.secondary" underline="hover">
          <TextToCopy>v{runtime.getManifest().version}</TextToCopy>
        </Link>
      </Stack>
    </FooterContainer>
  );
};

const FooterContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
  paddingInline: theme.spacing(4),
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
}));
