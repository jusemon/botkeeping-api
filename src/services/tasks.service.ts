import { FilterRequestParams, Service } from '../models/common';
import { PostTaskRequestBody, GetTaskResponseBody } from '../models/http';
import tasksRepository from '../repositories/tasks.repository';

type TasksService = Service<PostTaskRequestBody, GetTaskResponseBody>;

const create = async (task: PostTaskRequestBody) => {
  // Apply joi validations
  return await tasksRepository.create({ ...task, id: 0 });
};

const update = async (id: number, task: PostTaskRequestBody) => {
  // Apply joi validations
  return await tasksRepository.update({ ...task, id });
};

const read = async (id: number) => {
  // Apply joi validations
  return await tasksRepository.read(id);
};

const readAll = async (filter: FilterRequestParams) => {
  // Apply joi validations
  return await tasksRepository.readAll(filter);
};

const remove = async (id: number) => {
  // Apply joi validations
  return await tasksRepository.remove(id);
};

export default {
  create,
  read,
  readAll,
  update,
  remove,
} as TasksService;
