import { FilterRequestParams, Service } from '../models/common';
import { Task } from '../models/database';
import { PostTaskRequestBody, GetTaskResponseBody } from '../models/http';
import tasksRepository from '../repositories/tasks.repository';
import time from '../utils/time';

type TasksService = Service<PostTaskRequestBody, GetTaskResponseBody> & {
  complete: (task: Task) => Promise<void>;
};

const create = async (task: PostTaskRequestBody) => {
  return await tasksRepository.create({ ...task, id: 0 });
};

const update = async (id: number, task: PostTaskRequestBody) => {
  return await tasksRepository.update({ ...task, id });
};

const read = async (id: number) => {
  return await tasksRepository.read(id);
};

const readAll = async (filter: FilterRequestParams) => {
  return await tasksRepository.readAll(filter);
};

const remove = async (id: number) => {
  return await tasksRepository.remove(id);
};

const complete = async (task: Task) => {
  const startTime = Date.now();
  await tasksRepository.complete(task.id);
  const timeDiff = Date.now() - startTime;
  const duration = timeDiff < task.duration ? task.duration - timeDiff : 0;
  await time.sleep(duration);
};

export default {
  create,
  read,
  readAll,
  update,
  remove,
  complete
} as TasksService;
