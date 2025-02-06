import {
  CameraBlockedIcon,
  IconBaseProps,
  useTheme,
} from '@avalabs/core-k2-components';

export default function CameraAccessDeniedIcon(props: IconBaseProps) {
  const theme = useTheme();

  return (
    <CameraBlockedIcon
      size={38}
      sx={{
        outline: `2px solid ${theme.palette.error.main}`,
        outlineOffset: 3,
        backgroundColor: 'error.main',
        m: 1,
        p: 2,
        borderRadius: 999,
        border: 1,
        borderColor: 'error.main',
      }}
      {...props}
    />
  );
}
