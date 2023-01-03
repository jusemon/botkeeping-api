import { Queue } from 'bullmq';
import { Task } from '../models/database';
import config from '../config';

const { redis } = config;
const queue = new Queue('tasks', {
  connection: { host: redis.host, port: redis.port },
});

export const addTaskToQueue = async (task: Task) =>
  await queue.add(`process-task-${task.id}`, task);
