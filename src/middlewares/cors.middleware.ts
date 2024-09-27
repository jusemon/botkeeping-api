import cors from '@koa/cors';
import { Context } from 'koa';
import Router from 'koa-router';

import config from '../config';

const { server } = config;

const origin = (ctx: Context) => {
  const [defaultOrigin] = server.origins;
  if (ctx.headers.origin && server.origins.indexOf(ctx.headers.origin) > -1) {
    return ctx.header.origin || defaultOrigin;
  }
  return defaultOrigin;
};

const corsMiddleware: () => Router.IMiddleware<any, {}> = () =>
  cors({ origin });

export default corsMiddleware;
