import { MultiIconButton } from '@/components/MultiIconButton';
import { IconButtonProps, QrCodeIcon } from '@avalabs/k2-alpine';
import { FC, ReactElement } from 'react';
import { IconBaseProps } from 'react-icons';

type Props = IconButtonProps & {
  children: ReactElement<IconBaseProps>;
};

export const QRCodeIconButton: FC<Props> = ({ children, ...props }) => {
  return (
    <MultiIconButton icon={children} hoverIcon={<QrCodeIcon />} {...props} />
  );
};
