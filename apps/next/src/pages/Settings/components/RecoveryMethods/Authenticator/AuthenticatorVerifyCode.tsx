import {
  Button,
  Paper,
  Stack,
  styled,
  toast,
  Typography,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

const CodePaper = styled(Paper)(() => ({
  borderRadius: 2,
  overflow: 'hidden',
  width: '100%',
  flexDirection: 'row',
  px: 1.5,
  py: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mt: 4,
}));

export const AuthenticatorVerifyCode = ({ totpSecret, onNext }) => {
  const { t } = useTranslation();

  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      height="100%"
      width="100%"
    >
      <CodePaper elevation={1} sx={{}}>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ wordBreak: 'break-all', maxWidth: '60%' }}
        >
          {totpSecret}
        </Typography>
        <Button
          size="extension"
          variant="contained"
          color="secondary"
          onClick={() => {
            navigator.clipboard.writeText(totpSecret);
            toast.success(t('Code copied to clipboard'));
          }}
        >
          {t('Copy')}
        </Button>
      </CodePaper>
      {/** TODO: Put the description sections with ICONS after they put in the k2 alpine */}
      <Button onClick={onNext} color="primary" variant="contained" fullWidth>
        {t('Next')}
      </Button>
    </Stack>
  );
};
