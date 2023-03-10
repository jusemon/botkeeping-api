import koaBody from 'koa-body';
import Router from 'koa-router';
import { FilterRequestParams } from '../models/common';
import { postBotRequestBodySchema } from '../models/http';
import botsService from '../services/bots.service';

const router = new Router({ prefix: '/bots' });

router.post('/', koaBody(), async (ctx, next) => {
  const bot = await postBotRequestBodySchema.validateAsync(ctx.request.body);
  const result = await botsService.create(bot);
  ctx.body = result;
  await next();
});

router.put('/:id', koaBody(), async (ctx, next) => {
  const result = await botsService.update(parseInt(ctx.params.id), {
    ...ctx.request.body,
  });
  ctx.body = result;
  await next();
});

router.delete('/:id', async (ctx, next) => {
  const result = await botsService.remove(parseInt(ctx.params.id));
  ctx.body = result;

  await next();
});

router.get('/:id', async (ctx, next) => {
  const result = await botsService.read(parseInt(ctx.params.id));
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
  const result = await botsService.readAll(params);
  ctx.body = result;

  await next();
});

export default router;
