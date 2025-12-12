import { Checkbox, SxProps } from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { Trans } from 'react-i18next';

import { InTextLink } from '@/components/InTextLink';
import {
  Section,
  SectionLabel,
  SectionRow,
} from '@/pages/Onboarding/components/Section';

type Props = {
  onValidityChange: (isValid: boolean) => void;
};

const pointerSx: SxProps = {
  cursor: 'pointer',
};

export const TermsAgreementSection: FC<Props> = ({ onValidityChange }) => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  return (
    <Section bgcolor="transparent" p={0}>
      <SectionRow
        component="label"
        justifyContent="center"
        gap={0}
        py={0}
        sx={pointerSx}
      >
        <Checkbox
          checked={isTermsAccepted}
          onChange={(e) => {
            setIsTermsAccepted(e.target.checked);
            onValidityChange(e.target.checked);
          }}
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
