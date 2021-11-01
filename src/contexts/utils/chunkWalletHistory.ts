import { WalletState } from '@avalabs/wallet-react-components';
import { isSameDay, endOfYesterday, endOfToday, format } from 'date-fns';

const yesterday = endOfYesterday();
const today = endOfToday();

export function chunkHistoryByDate(history: WalletState['recentTxHistory']) {
  return history.reduce((acc, hist) => {
    const date = new Date(hist.timestamp);
    const isToday = isSameDay(today, date);
    const isYesterday = isSameDay(yesterday, date);
    const relativeDateOf = isToday
      ? 'Today'
      : isYesterday
      ? 'Yesterday'
      : format(date, 'MMMM do');
    const chunk = acc[relativeDateOf] ?? [];
    const newChunk = [...chunk, hist];
    return { ...acc, [relativeDateOf]: newChunk };
  }, {});
}
