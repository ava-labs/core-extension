import {
  HideIcon,
  IconButton,
  InputAdornment,
  SxProps,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

type Props = {
  visible: boolean;
  onHide: VoidFunction;
  onShow: VoidFunction;
};

const colorSx: SxProps = {
  color: 'currentColor',
};

export const ShowPasswordAdornment: React.FC<Props> = ({
  visible,
  onHide,
  onShow,
}) => {
  const { t } = useTranslation();
  return (
    <InputAdornment sx={colorSx} position="end">
      <IconButton
        sx={colorSx}
        size="small"
        aria-label={visible ? t('Hide password') : t('Show password')}
        onMouseUp={onHide}
        onMouseDown={onShow}
        disableRipple
        tabIndex={-1}
      >
        <HideIcon
          size={24}
          sx={{
            position: 'absolute',
            right: 0,
            opacity: visible ? 0.5 : 1,
          }}
        />
      </IconButton>
    </InputAdornment>
  );
};
