import { Subject } from 'rxjs';

export const walletUnlock$ = new Subject<{ value: string }>();
