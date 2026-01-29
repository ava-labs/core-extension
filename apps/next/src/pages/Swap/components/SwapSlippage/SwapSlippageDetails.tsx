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
import {
  MIN_SLIPPAGE,
  MAX_SLIPPAGE,
  DEFAULT_SLIPPAGE,
} from '../../swap-config';
import {
  validateSlippage,
  isSlippageValid,
} from '../../lib/slippageValidation';

interface SwapSlippageDetailsProps {
  open: boolean;
  onClose: () => void;
}

const PRESET_SLIPPAGES = [1, 2] as const;

export const SwapSlippageDetails: FC<SwapSlippageDetailsProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { slippage, setSlippage, autoSlippage, setAutoSlippage } =
    useSwapState();

  const [localSlippage, setLocalSlippage] = useState(slippage);
  const [isCustom, setIsCustom] = useState(false);
  const [customInput, setCustomInput] = useState(String(slippage));
  const customInputRef = useRef<HTMLInputElement>(null);

  // Derive error/warning from current input value
  const validation = validateSlippage(
    isCustom ? customInput : String(localSlippage),
    t,
  );
  const error = validation.error ?? null;
  const warning = validation.warning ?? null;

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
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    setAutoSlippage(false);
  };

  const handleCustomInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    // Reject if more than 1 decimal place
    const decimalIndex = value.indexOf('.');
    if (decimalIndex !== -1 && value.length - decimalIndex > 2) {
      return;
    }

    setCustomInput(value);
    setAutoSlippage(false);

    // Only update local state if valid, prevents focus loss while typing
    const inputValidation = validateSlippage(value, t);
    if (inputValidation.success && inputValidation.value !== undefined) {
      setLocalSlippage(inputValidation.value);
    }
  };

  const commitCustomValue = (value: string) => {
    const numValue = parseFloat(value);

    if (isSlippageValid(value)) {
      setSlippage(numValue);
      setLocalSlippage(numValue);
    } else {
      // Reset to default if invalid (< MIN or > MAX)
      setCustomInput(String(DEFAULT_SLIPPAGE));
      setSlippage(DEFAULT_SLIPPAGE);
      setLocalSlippage(DEFAULT_SLIPPAGE);
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

  const displayValue = autoSlippage
    ? t('Auto • {{slippage}}%', { slippage })
    : t('{{slippage}}%', { slippage });

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
                        disabled={autoSlippage}
                        color={
                          !autoSlippage && !isCustom && localSlippage === preset
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
                    {isCustom && !autoSlippage ? (
                      <Box
                        sx={{
                          flex: 1,
                          flexBasis: 0,
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
                          max={MAX_SLIPPAGE}
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
                        disabled={autoSlippage}
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

          {/* Error or warning message - below the card */}
          {(error || warning) && (
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
                  color: error ? 'error.main' : 'text.primary',
                  fontWeight: 500,
                }}
              >
                {error ?? (
                  <>
                    {'\u26A0 '}
                    {warning}
                  </>
                )}
              </Typography>
            </Box>
          )}
        </Stack>
      </Page>
    </SlideUpDialog>
  );
};
