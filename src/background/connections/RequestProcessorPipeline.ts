import { Context, Middleware, Pipeline } from './middlewares/models';

export function RequestProcessorPipeline<RequestType, ResponseType>(
  ...middlewares: Middleware<RequestType, ResponseType>[]
): Pipeline<RequestType, ResponseType> {
  const stack: Middleware<RequestType, ResponseType>[] = middlewares;

  const push = (middleware: Middleware<RequestType, ResponseType>) => {
    stack.push(middleware);
  };

  const execute = (context: Context<RequestType, ResponseType>) => {
    let prevIndex = -1;

    return new Promise<Context<RequestType, ResponseType>>(
      (resolve, reject) => {
        const runner = async (index: number): Promise<void> => {
          if (index === prevIndex) {
            // we don't want to skip any middleware
            reject(new Error('next() called multiple times'));
          }

          prevIndex = index;

          const middleware = stack[index];
          if (middleware) {
            middleware(
              context,
              () => {
                return runner(index + 1);
              },
              (error) => {
                // error from the middleware, halt execution
                reject(error);
              },
            );
          } else {
            // no more middlewares, execution finished
            resolve(context);
          }
        };
        runner(0);
      },
    );
  };

  return { push, execute };
}
