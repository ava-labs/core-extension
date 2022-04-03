import { BehaviorSubject } from 'rxjs';

export const storageKey$ = new BehaviorSubject<string | null>(null);
