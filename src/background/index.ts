// initialize sentry first to enable error collection
import '../monitoring/initSentryForBackground';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { BackgroundRuntime } from './runtime/BackgroundRuntime';
import '@src/localization/init';

const runtime = container.resolve(BackgroundRuntime);
runtime.activate();
