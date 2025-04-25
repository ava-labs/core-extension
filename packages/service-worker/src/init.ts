// initialize sentry first to enable error collection
import './monitoring/initSentryForBackground';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { BackgroundRuntime } from './runtime/BackgroundRuntime';
import '@shared/localization/init';
import Big from 'big.js';

Big.PE = 99;
Big.NE = -18;

const runtime = container.resolve(BackgroundRuntime);
runtime.activate();
