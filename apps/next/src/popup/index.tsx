// initialize sentry first to enable error collection
import '../monitoring/initSentryForPopup';

import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
// MemoryRouter doesn't handle deep linking well.  And BrowserRouter doesn't work in extensions.
import { HashRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/localization/init';
import {
  ThemeProvider,
  Stack,
  Dialog,
  Typography,
  DialogContent,
} from '@avalabs/k2-alpine';

const root = createRoot(document.getElementById('popup') as HTMLElement);

browser.tabs.query({ active: true }).then(() => {
  root.render(
    <Sentry.ErrorBoundary>
      <Router>
        <ThemeProvider theme="light">
          <I18nextProvider i18n={i18n}>
            <Stack>
              <Dialog open={true} onClose={() => {}}>
                <DialogContent>
                  <Typography variant="h5">
                    Hi from Next:Gen Core! 😇
                  </Typography>
                </DialogContent>
              </Dialog>
            </Stack>
          </I18nextProvider>
        </ThemeProvider>
      </Router>
    </Sentry.ErrorBoundary>,
  );
});
