import { FilterRequestParams, Service } from '../models/common';
import { PostBotRequestBody, GetBotResponseBody } from '../models/http';
import botsRepository from '../repositories/bots.repository';

type BotsService = Service<PostBotRequestBody, GetBotResponseBody>;

const create = async (body: PostBotRequestBody) => {
  // Apply joi validations
  return await botsRepository.create({ ...body, id: 0 });
};

const update = async (id: number, bot: PostBotRequestBody) => {
  // Apply joi validations
  return await botsRepository.update({ ...bot, id });
};

const read = async (id: number) => {
  // Apply joi validations
  return await botsRepository.read(id);
};

const readAll = async (filter: FilterRequestParams) => {
  // Apply joi validations
  return await botsRepository.readAll(filter);
};

const remove = async (id: number) => {
  // Apply joi validations
  return await botsRepository.remove(id);
};

export default {
  create,
  read,
  readAll,
  update,
  remove,
} as BotsService;
