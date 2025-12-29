import { FC, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Stack,
  Typography,
  Switch,
  Card,
  Box,
  Divider,
  useTheme,
} from '@avalabs/k2-alpine';

import { SlideUpDialog } from '@/components/Dialog';
import { Page } from '@/components/Page';
import { InvisibileInput } from '@/components/Forms/InvisibleInput';
import * as LocalStyled from './Styled';
import { useSwapState } from '../../contexts/SwapStateContext';
import { MIN_SLIPPAGE, DEFAULT_SLIPPAGE } from '../../swap-config';
import { isSlippageValid } from '../../lib/isSlippageValid';

interface SwapSlippageDetailsProps {
  open: boolean;
  onClose: () => void;
}

const PRESET_SLIPPAGES = [0.2, 0.5, 1, 2] as const;

export const SwapSlippageDetails: FC<SwapSlippageDetailsProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { slippage, setSlippage, autoSlippage, setAutoSlippage } =
    useSwapState();

  const [localSlippage, setLocalSlippage] = useState(slippage);
  const [isCustom, setIsCustom] = useState(
    !PRESET_SLIPPAGES.includes(slippage as any),
  );
  const [customInput, setCustomInput] = useState(String(slippage));
  const [error, setError] = useState<string | null>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  // Sync local state when modal opens or slippage changes
  useEffect(() => {
    if (open) {
      setLocalSlippage(slippage);
      setCustomInput(String(slippage));
      setIsCustom(!PRESET_SLIPPAGES.includes(slippage as any));
      setError(null);
    }
  }, [open, slippage]);

  // Focus custom input when custom is selected
  useEffect(() => {
    if (isCustom && customInputRef.current) {
      customInputRef.current.focus();
      customInputRef.current.select();
    }
  }, [isCustom]);

  const handleAutoToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;
    setAutoSlippage(isEnabled);

    // When enabling auto slippage, reset to default if no recommended slippage yet
    // The SwapStateContext will update to recommendedSlippage once a quote is available
    if (isEnabled) {
      setSlippage(DEFAULT_SLIPPAGE);
      setLocalSlippage(DEFAULT_SLIPPAGE);
      setCustomInput(String(DEFAULT_SLIPPAGE));
    }
  };

  const handlePresetClick = (preset: number) => {
    setLocalSlippage(preset);
    setSlippage(preset);
    setIsCustom(false);
    setAutoSlippage(false);
    setError(null);
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    setAutoSlippage(false);
    setError(null);
  };

  const handleCustomInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setCustomInput(value);
    setAutoSlippage(false);

    // Check if value is greater than 100
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 100) {
      setError(t('Slippage must be less than or equal to 100%'));
      return;
    } else {
      setError(null);
    }

    // Only update local state for validation, don't update global slippage yet
    // This prevents focus loss while typing
    if (isSlippageValid(value)) {
      setLocalSlippage(numValue);
    }
  };

  const commitCustomValue = (value: string) => {
    const numValue = parseFloat(value);

    // If value is greater than 100, reset to MIN_SLIPPAGE
    if (!isNaN(numValue) && numValue > 100) {
      setCustomInput(String(MIN_SLIPPAGE));
      setSlippage(MIN_SLIPPAGE);
      setLocalSlippage(MIN_SLIPPAGE);
      setError(null);
      return;
    }

    // Commit the valid value to global state
    if (isSlippageValid(value)) {
      setSlippage(numValue);
      setLocalSlippage(numValue);
    } else {
      // Reset to MIN_SLIPPAGE if invalid
      setCustomInput(String(MIN_SLIPPAGE));
      setSlippage(MIN_SLIPPAGE);
      setLocalSlippage(MIN_SLIPPAGE);
      setError(null);
    }
  };

  const handleCustomInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    commitCustomValue(event.target.value);
  };

  const handleCustomInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      commitCustomValue(target.value);
      target.blur(); // Remove focus to hide keyboard on mobile
    }
  };

  const displayValue = autoSlippage ? `Auto • ${slippage}%` : `${slippage}%`;

  return (
    <SlideUpDialog open={open} onClose={onClose}>
      <Page
        title={t('Slippage details')}
        onBack={onClose}
        contentProps={{
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'normal',
        }}
      >
        <Stack width="100%" gap={1}>
          <Card sx={{ borderRadius: theme.shape.largeBorderRadius }}>
            <Stack width="100%" gap={0} divider={<Divider />} px={2}>
              {/* Current slippage display */}
              <Box py={1.5}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body3">{t('Slippage')}</Typography>
                  <Typography
                    variant="body3"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    {displayValue}
                  </Typography>
                </Stack>
              </Box>

              {/* Auto slippage toggle */}
              <Box py={1.5}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack gap={0.25}>
                    <Typography variant="body3">
                      {t('Auto slippage')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t(
                        'Core will find the lowest slippage for a successful swap',
                      )}
                    </Typography>
                  </Stack>
                  <Switch
                    checked={autoSlippage}
                    onChange={handleAutoToggle}
                    size="small"
                  />
                </Stack>
              </Box>

              {/* Manual slippage section */}
              <Box py={1.5}>
                <Stack gap={1}>
                  <Stack gap={0.25}>
                    <Typography variant="body3">
                      {t('Manual slippage')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t(
                        'Your transaction will fail if the price changes more than the slippage',
                      )}
                    </Typography>
                  </Stack>

                  {/* Preset buttons and custom input */}
                  <Stack direction="row" gap={0.75}>
                    {PRESET_SLIPPAGES.map((preset) => (
                      <LocalStyled.SlippagePresetButton
                        key={preset}
                        color={
                          !isCustom && localSlippage === preset
                            ? 'primary'
                            : 'secondary'
                        }
                        onClick={() => handlePresetClick(preset)}
                        sx={{
                          height: '46px',
                          borderRadius: theme.shape.mediumBorderRadius,
                        }}
                      >
                        {preset}%
                      </LocalStyled.SlippagePresetButton>
                    ))}
                    {/* Custom button as input */}
                    {isCustom ? (
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          px: 1,
                          height: '46px',
                          borderRadius: theme.shape.mediumBorderRadius,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        }}
                      >
                        <InvisibileInput
                          ref={customInputRef}
                          value={customInput}
                          onChange={handleCustomInputChange}
                          onBlur={handleCustomInputBlur}
                          onKeyDown={handleCustomInputKeyDown}
                          min={MIN_SLIPPAGE}
                          max={100}
                          step={0.1}
                          type="number"
                          inputMode="decimal"
                          sx={{
                            textAlign: 'center',
                            px: 0,
                            flex: 1,
                            color: 'inherit',
                          }}
                          placeholder={String(MIN_SLIPPAGE)}
                        />
                        <Typography variant="body3" sx={{ color: 'inherit' }}>
                          %
                        </Typography>
                      </Box>
                    ) : (
                      <LocalStyled.SlippagePresetButton
                        color="secondary"
                        onClick={handleCustomClick}
                        sx={{
                          height: '46px',
                          borderRadius: theme.shape.mediumBorderRadius,
                        }}
                      >
                        {t('Custom')}
                      </LocalStyled.SlippagePresetButton>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Card>

          {/* Error message - below the card */}
          {error && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  textAlign: 'center',
                  color: 'error.main',
                  fontWeight: 500,
                }}
              >
                {error}
              </Typography>
            </Box>
          )}
        </Stack>
      </Page>
    </SlideUpDialog>
  );
};
