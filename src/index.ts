import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';

import config from './config';
import tasksRoute from './routes/tasks.route';
import botsRoute from './routes/bots.route';

const { server } = config;
const app = new Koa();

// Middlewares
app.use(json());
app.use(logger());

// Routes
const router = new Router({ prefix: `/api/v${server.apiVersion}` });
router.use(tasksRoute.routes()).use(botsRoute.routes());
app.use(router.routes()).use(router.allowedMethods());

app.listen(server.port, () => {
  console.log(`Server started at port ${server.port}`);
});
