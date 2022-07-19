// initialize sentry first to enable error collection
import '../utils/initSentry';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { BackgroundRuntime } from './runtime/BackgroundRuntime';

const runtime = container.resolve(BackgroundRuntime);
runtime.activate();
