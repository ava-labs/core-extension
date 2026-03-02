import { Box, toast, Tooltip } from '@avalabs/k2-alpine';
import {
  cloneElement,
  FC,
  isValidElement,
  PropsWithChildren,
  useId,
} from 'react';
import { useTranslation } from 'react-i18next';

export const TextToCopy: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const id = useId();

  const element = isValidElement(children) ? (
    children
  ) : (
    <Box component="span">{children}</Box>
  );
  const clickable = cloneElement(element, {
    sx: {
      ...element.props.sx,
      cursor: 'pointer',
    },
    onClick: (e: React.MouseEvent<HTMLSpanElement>) => {
      element.props.onClick?.(e);
      const textContent = e.currentTarget.textContent;
      if (textContent) {
        navigator.clipboard.writeText(textContent);
        toast.success(t('Copied!'), {
          id: `${id}-copied`,
        });
      }
    },
  });

  return (
    <Tooltip title={t('Click to copy')} enterDelay={0} followCursor>
      {clickable}
    </Tooltip>
  );
};
