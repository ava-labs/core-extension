import { HideIcon, InputAdornment, IconButton } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

type Props = {
  visible: boolean;
  onHide: VoidFunction;
  onShow: VoidFunction;
};

export const ShowPasswordAdornment: React.FC<Props> = ({
  visible,
  onHide,
  onShow,
}) => {
  const { t } = useTranslation();
  return (
    <InputAdornment position="end">
      <IconButton
        size="small"
        aria-label={visible ? t('Hide password') : t('Show password')}
        onMouseUp={onHide}
        onMouseDown={onShow}
        edge="end"
      >
        <HideIcon
          size={24}
          sx={{
            position: 'absolute',
            right: 0,
            color: visible ? 'text.secondary' : 'text.primary',
          }}
        />
      </IconButton>
    </InputAdornment>
  );
};
