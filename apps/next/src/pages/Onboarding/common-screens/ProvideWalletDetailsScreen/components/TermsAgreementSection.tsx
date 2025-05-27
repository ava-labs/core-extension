import { Trans } from 'react-i18next';
import { Checkbox, combineSx, StackProps } from '@avalabs/k2-alpine';
import { FC, useEffect, useState } from 'react';

import {
  Section,
  SectionLabel,
  SectionRow,
} from '@/pages/Onboarding/components/Section';
import { InTextLink } from '@/components/InTextLink';

type Props = StackProps & {
  onValidityChange: (isValid: boolean) => void;
};

export const TermsAgreementSection: FC<Props> = ({
  sx,
  onValidityChange,
  ...props
}) => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  useEffect(() => {
    onValidityChange(isTermsAccepted);
  }, [isTermsAccepted, onValidityChange]);

  return (
    <Section sx={combineSx({ py: 0.5 }, sx)} {...props}>
      <SectionRow
        component="label"
        sx={{
          cursor: 'pointer',
          textAlign: 'center',
          justifyContent: 'center',
          gap: 0,
          py: 0,
        }}
      >
        <Checkbox
          checked={isTermsAccepted}
          onChange={(e) => setIsTermsAccepted(e.target.checked)}
        />
        <SectionLabel>
          <Trans
            i18nKey="I have read and agree to the <termLink>Terms of Use</termLink>"
            components={{
              termLink: (
                <InTextLink
                  sx={{ ml: 0.5 }}
                  target="_blank"
                  href="https://core.app/terms/core"
                  rel="noreferrer"
                />
              ),
            }}
          />
        </SectionLabel>
      </SectionRow>
    </Section>
  );
};
