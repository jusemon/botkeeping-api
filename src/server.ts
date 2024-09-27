import { NetworkInterfaceInfo, networkInterfaces } from 'os';
import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';

import config from './config';
import tasksRoute from './routes/tasks.route';
import botsRoute from './routes/bots.route';
import errorMiddleware from './middlewares/error.middleware';
import corsMiddleware from './middlewares/cors.middleware';

const { server } = config;

const startServerLog = (port: number) => async () => {
  const net = Object.values(networkInterfaces())
    .flat()
    .filter((v) => v?.family === 'IPv4')
    .sort((v) => (v!.internal ? -1 : 1)) as Array<NetworkInterfaceInfo>;

  console.info('Server started successfully!');
  console.info('You can now use the service.');

  net.forEach(({ internal, address }) =>
    console.info(
      `\t${(internal ? 'Local:' : 'On Your Network:').padEnd(
        20,
        ' ',
      )}http://${address}:${port}`,
    ),
  );
};

export const initializeServer = () => {
  const app = new Koa();

  // Middlewares
  app.use(corsMiddleware());
  app.use(json());
  app.use(logger());
  app.use(errorMiddleware());

  // Routes
  const router = new Router({ prefix: `/api/v${server.apiVersion}` });
  router.use(tasksRoute.routes()).use(botsRoute.routes());
  app.use(router.routes()).use(router.allowedMethods());

  app.listen(server.port, server.host, startServerLog(server.port));
};
