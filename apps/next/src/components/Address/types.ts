import { TypographyProps } from '@avalabs/k2-alpine';
import { ComponentType, ReactElement } from 'react';
import { IconBaseProps } from 'react-icons';

export type AddressEnablerProps = {
  Icon: ComponentType<IconBaseProps> | ReactElement<IconBaseProps>;
  label: string;
  labelVariant: TypographyProps['variant'];
  visibility?: 'always' | 'hover';
};
