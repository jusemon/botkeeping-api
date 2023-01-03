import { Queue } from 'bullmq';
import { Task } from '../../models/database';
import config from '../../config';

const { redis } = config;
const queue = new Queue('tasks', {
  connection: { host: redis.host, port: redis.port },
});

export const addTasksToQueue = async (tasks: ReadonlyArray<Task>) =>
  await queue.add(`process-tasks-${tasks.map((t) => t.id).join('-')}`, tasks);
