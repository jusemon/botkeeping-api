import { Worker } from 'bullmq';
import { Task } from '../../models/database';
import config from '../../config';
import { Pool, spawn, Worker as TWorker } from 'threads';

const { redis } = config;

export const initializeTaskConsumer = () => {
  const worker = new Worker<Array<Task>>(
    'tasks',
    async (job) => {
      const { data: tasks } = job;
      const pool = Pool(() => spawn(new TWorker('../workers/tasks.worker')));

      for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];
        pool.queue(async (taskWorker) => {
          console.log(`Task ${task.id}: starting at ${new Date()}`);
          console.time(`Task ${task.id}`);
          await taskWorker(task);
          console.timeEnd(`Task ${task.id}`);
        });
      }
      await pool.completed();
      await pool.terminate();
    },
    { connection: { host: redis.host, port: redis.port } },
  );

  worker.on('completed', (job) => {
    console.log(`All tasks in job ${job.id} has been completed!`);
  });

  worker.on('failed', (job, err) => {
    console.log(`The job ${job?.id} has failed with "${err.message}"`);
  });
};
