import { BrandName } from '@/components/BrandName';
import {
  Button,
  Stack,
  TextField,
  Box,
  Avatar,
  InputAdornment,
  IconButton,
  TriangleDownIcon as VisibilityOff,
  TriangleUpIcon as Visibility,
} from '@avalabs/k2-alpine';
import { FC, useEffect, useState } from 'react';
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
  const [showUnlockForm, setShowUnlockForm] = useState(false);

  console.log(isLoading, error);

  useEffect(() => {
    setTimeout(setShowUnlockForm, 2000, true);
  }, []);

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
      bgcolor="background.paper"
      height="100%"
      px="20px"
      sx={{
        container: 'root / size',
      }}
    >
      <BrandName margin="auto 0" />
      <Stack marginBlockEnd={showUnlockForm ? 8 : '20cqh'} alignItems="center">
        <Avatar
          src="/images/__REMOVE_ME_bear.svg"
          sx={{ width: 88, height: 88 }}
        />
      </Stack>
      {showUnlockForm && (
        <>
          <Stack direction="column" rowGap={1.5}>
            <TextField
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? 'hide the password'
                            : 'display the password'
                        }
                        onClick={() => setShowPassword((state) => !state)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff size="16" />
                        ) : (
                          <Visibility size="16" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button variant="contained" onClick={handleSubmit}>
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
        </>
      )}
    </Box>
  );
};
