// initialize sentry first to enable error collection
import { initI18n } from '@core/common';
import Big from 'big.js';
import 'reflect-metadata';
import { container } from 'tsyringe';
import './monitoring/initSentryForBackground';
import { BackgroundRuntime } from './runtime/BackgroundRuntime';

Big.PE = 99;
Big.NE = -18;

// Initialize translations
initI18n();

const runtime = container.resolve(BackgroundRuntime);
await runtime.activate();
