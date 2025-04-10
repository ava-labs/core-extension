// initialize sentry first to enable error collection
import '../monitoring/initSentryForBackground';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { BackgroundRuntime } from './runtime/BackgroundRuntime';
import '@src/localization/init';
import Big from 'big.js';

Big.PE = 99;
Big.NE = -18;

console.log('bruvbayscbiashcbiadbc');
const runtime = container.resolve(BackgroundRuntime);
console.log('unruecnascasd', runtime);
runtime.activate();
