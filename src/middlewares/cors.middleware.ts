import cors from '@koa/cors';
import { Context } from 'koa';
import Router from 'koa-router';

import config from '../config';

const { server } = config;

const origin = (ctx: Context) => {
  const [defaulOrigin] = server.origins;
  if (ctx.headers.origin && server.origins.includes(ctx.headers.origin)) {
    return ctx.header.origin || defaulOrigin;
  }
  return defaulOrigin;
};

const corsMiddleware: () => Router.IMiddleware<any, {}> = () => cors({ origin });

export default corsMiddleware;
