// initialize sentry first to enable error collection
import './monitoring/initSentryForBackground';
import 'reflect-metadata';
import { initI18n } from '@core/common';
import { container } from 'tsyringe';
import { BackgroundRuntime } from './runtime/BackgroundRuntime';
import Big from 'big.js';

Big.PE = 99;
Big.NE = -18;

// Initialize translations
initI18n();

const runtime = container.resolve(BackgroundRuntime);
runtime.activate();
