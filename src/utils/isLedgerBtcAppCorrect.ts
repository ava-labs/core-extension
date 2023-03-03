import { compare } from 'compare-versions';

type AppInfo = {
  applicationName: string;
  version: string;
};

// We support Ledger Bitcoin applications with version < 2.1.0
// Or any version of Bitcoin Legacy applications
const FIRST_UNSUPPORTED_BTC_VERSION = '2.1.0';

const isLedgerBtcAppCorrect = ({ applicationName, version }: AppInfo) => {
  if (applicationName === 'Bitcoin Legacy') {
    return true;
  } else if (applicationName === 'Bitcoin') {
    return compare(version, FIRST_UNSUPPORTED_BTC_VERSION, '<');
  }

  // incorrect params, let's consider it valid
  return true;
};

export default isLedgerBtcAppCorrect;
