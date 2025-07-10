import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonProps, OutboundIcon } from '@avalabs/k2-alpine';

export const KeystoneSupportButton: FC<ButtonProps> = ({
  children,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Button
      size="medium"
      variant="text"
      endIcon={<OutboundIcon size={24} />}
      component="a"
      href="https://guide.keyst.one/docs/connecting-software-wallets-to-keystone"
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children ?? t('Keystone support')}
    </Button>
  );
};
