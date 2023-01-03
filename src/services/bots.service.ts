import { FilterRequestParams, Service } from '../models/common';
import { PostBotRequestBody, GetBotResponseBody } from '../models/http';
import { addTasksToQueue } from '../queues/producers/tasks.producer';
import botsRepository from '../repositories/bots.repository';

type BotsService = Service<PostBotRequestBody, GetBotResponseBody>;

const create = async (body: PostBotRequestBody) => {
  const bot = await botsRepository.create({ ...body, id: 0 });
  if (bot.tasks) {
    addTasksToQueue(bot.tasks);
  }
  return bot;
};

const update = async (id: number, bot: PostBotRequestBody) => {
  return await botsRepository.update({ ...bot, id });
};

const read = async (id: number) => {
  return await botsRepository.read(id);
};

const readAll = async (filter: FilterRequestParams) => {
  return await botsRepository.readAll(filter);
};

const remove = async (id: number) => {
  return await botsRepository.remove(id);
};

export default {
  create,
  read,
  readAll,
  update,
  remove,
} as BotsService;
