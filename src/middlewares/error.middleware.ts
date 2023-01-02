import Router from "koa-router"
import { isValidationError } from "../utils/type-guards";

const errorMiddleware: () => Router.IMiddleware<any, {}> = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log('error middleware', err);
    if (err && (err as any).status >= 500) console.log('Error handler:', err);
    if (isValidationError(err)) {
      ctx.status = 400;
    } else {
      ctx.status = (err as any).status || 500;
    }

    ctx.body = {
      status: 'failed',
      message: (err as any).message || 'Internal server error',
    };
  }
}

export default errorMiddleware;
