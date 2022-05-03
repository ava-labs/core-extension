import 'reflect-metadata';
import { container } from 'tsyringe';
import { BackgroundRuntime } from './BackgroundRuntime';

const runtime = container.resolve(BackgroundRuntime);
runtime.activate();
