import { Worker } from 'bullmq';
import { Task } from '../models/database';
import config from '../config';
import tasksService from '../services/tasks.service';

const { redis } = config;

export const initializeTaskConsumer = () => {
  const worker = new Worker<Task>('tasks', async (job) => {
    await tasksService.complete(job.data);
  }, { connection: { host: redis.host, port: redis.port }});
  
  worker.on('completed', (job) => {
    console.log(`${job.id} has completed!`);
  });
  
  worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
  });
}
