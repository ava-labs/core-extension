import { Tooltip, TooltipProps } from '@avalabs/k2-alpine';
import { useOnline } from '@core/ui';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

type OfflineTooltipProps = Omit<TooltipProps, 'title'> & {
  children: React.ReactElement;
};

/**
 * @description A Tooltip component that shows "You are offline" when the user is offline, otherwise shows nothing.
 * Wraps children in a span to ensure proper tooltip behavior with disabled elements.
 */
export const OfflineTooltip = ({
  children,
  ...tooltipProps
}: PropsWithChildren<OfflineTooltipProps>) => {
  const { t } = useTranslation();
  const { isOnline } = useOnline();

  return (
    <Tooltip title={!isOnline ? t('You are offline') : ''} {...tooltipProps}>
      <span>{children}</span>
    </Tooltip>
  );
};
