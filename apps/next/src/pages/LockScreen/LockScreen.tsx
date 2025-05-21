import { CoreSplash } from '@/components/CoreSplash';
import { StandaloneField } from '@/components/StandaloneField';
import {
  Button,
  Stack,
  Box,
  InputAdornment,
  IconButton,
  HideIcon,
  Collapse,
  Theme,
} from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  unlockWallet(password: string): Promise<void>;
};

export const LockScreen: FC<Props> = ({ unlockWallet }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // TODO: Ensure this is set to FALSE once the work is done
  const [showUnlockForm, setShowUnlockForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await unlockWallet(password);
    } catch {
      setError(t('Invalid password'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      id="lock-screen"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      height={1}
      width={1}
      px="20px"
      sx={{
        container: 'root / size',
      }}
    >
      <Box position="absolute" top={0} left={0} right={0}>
        <div style={{ position: 'absolute', top: 0, right: 0 }}>DPS</div>
      </Box>
      <CoreSplash
        style={{ marginBlock: 'auto' }}
        onGifEnd={() => setShowUnlockForm(true)}
      />
      <Stack marginBlockEnd={showUnlockForm ? 8 : '20cqh'} alignItems="center">
        <img src="/images/__REMOVE_ME_bear.svg" width={88} height={88} />
      </Stack>
      <Collapse in={showUnlockForm}>
        <Stack direction="column" rowGap={1.5}>
          <StandaloneField
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label={
                        showPassword
                          ? 'hide the password'
                          : 'display the password'
                      }
                      onMouseUp={() => setShowPassword(false)}
                      onMouseDown={() => setShowPassword(true)}
                      edge="end"
                    >
                      <HideIcon
                        size={24}
                        sx={(theme: Theme) => ({
                          position: 'absolute',
                          right: 0,
                          color: showPassword
                            ? theme.palette.text.secondary
                            : theme.palette.text.primary,
                        })}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            disabled={!password}
            variant="contained"
            onClick={handleSubmit}
            loading={isLoading}
          >
            Login
          </Button>
        </Stack>
        <Box
          display="flex"
          height="20cqh"
          alignItems="center"
          justifyContent="center"
        >
          <Button variant="text" size="small">
            Forgot password?
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};
