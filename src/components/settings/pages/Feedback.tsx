import { SettingsHeader } from '../SettingsHeader';
import { useTranslation } from 'react-i18next';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import browser from 'webextension-polyfill';
import { useEffect, useState } from 'react';

const osMap = {
  mac: 'macOS',
  win: 'Windows',
  linux: 'Linux',
};

export function Feedback({ goBack, navigateTo, width }) {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const extensionVersion = browser.runtime.getManifest().version;
  const [os, setOs] = useState('');

  useEffect(() => {
    browser.runtime.getPlatformInfo().then((res) => setOs(osMap[res.os]));
  }, []);

  return (
    <Stack
      sx={{
        width,
        height: '100%',
      }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Send Feedback')}
      />
      <List>
        <ListItem sx={{ p: 0 }}>
          <ListItemButton
            sx={{
              py: 0.5,
              px: 2,
              m: 0,
              '&:hover': { borderRadius: 0 },
            }}
            onClick={async () => {
              try {
                await capture('ReportBugClicked');
              } catch (err) {
                console.error(err);
              }
              window.open(
                `https://docs.google.com/forms/d/e/1FAIpQLSdUQiVnJoqQ1g_6XTREpkSB5vxKKK8ba5DRjhzQf1XVeET8Rw/viewform?usp=pp_url&entry.2070152111=Core%20browser%20extension&entry.903657115=${extensionVersion}&entry.1148340936=${os}`,
                '_blank'
              );
            }}
            data-testid="report-bug-link"
          >
            <ListItemText>
              <Typography variant="body2">{t('Report a Bug')}</Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ p: 0 }}>
          <ListItemButton
            sx={{
              py: 0.5,
              px: 2,
              m: 0,
              '&:hover': { borderRadius: 0 },
            }}
            onClick={async () => {
              try {
                await capture('ProductFeedbackRequestClicked');
              } catch (err) {
                console.error(err);
              }
              window.open(
                `https://portal.productboard.com/dndv9ahlkdfye4opdm8ksafi/tabs/1-core-browser-extension`,
                '_blank'
              );
            }}
            data-testid="product-feedback-request-link"
          >
            <ListItemText>
              <Typography variant="body2">
                {t('Product Feedback & Feature Requests')}
              </Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Stack>
  );
}
