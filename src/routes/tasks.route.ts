import koaBody from 'koa-body';
import Router from 'koa-router';
import { FilterRequestParams } from '../models/common';
import tasksService from '../services/tasks.service';

const router = new Router({ prefix: '/tasks' });

router.post('/', koaBody(), async (ctx, next) => {
  const result = await tasksService.create(ctx.request.body);
  ctx.body = result;
  await next();
});

router.put('/:id', koaBody(), async (ctx, next) => {
  const result = await tasksService.update(parseInt(ctx.params.id), {
    ...ctx.request.body,
  });
  ctx.body = result;
  await next();
});

router.delete('/:id', async (ctx, next) => {
  const result = await tasksService.remove(parseInt(ctx.params.id));
  ctx.body = result;
  await next();
});

router.get('/:id', async (ctx, next) => {
  const result = await tasksService.read(parseInt(ctx.params.id));
  ctx.body = result;
  await next();
});

router.get('/', async (ctx, next) => {
  const { filter, page, pageSize } = ctx.request.query;
  const params: FilterRequestParams = {
    ...(filter ? { filter: filter.toString() } : {}),
    ...(page ? { page: Number(page) } : {}),
    ...(pageSize ? { pageSize: Number(pageSize) } : {}),
  };
  const result = await tasksService.readAll(params);
  ctx.body = result;
  await next();
});

export default router;
