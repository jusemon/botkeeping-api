import { FilterRequestParams, Service } from '../models/common';
import { PostBotRequestBody, GetBotResponseBody } from '../models/http';
import { addTaskToQueue } from '../producers/tasks.producer';
import botsRepository from '../repositories/bots.repository';

type BotsService = Service<PostBotRequestBody, GetBotResponseBody>;

const create = async (body: PostBotRequestBody) => {
  const bot = await botsRepository.create({ ...body, id: 0 });
  if (bot.tasks) {
    for (let index = 0; index < bot.tasks.length; index++) {
      const task = bot.tasks[index];
      console.log(`Adding ${task.id} to queue.`)
      await addTaskToQueue(task);
      console.log(`${task.id} added.`)
    }
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
