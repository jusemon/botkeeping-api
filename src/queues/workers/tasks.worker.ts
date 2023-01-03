import { expose } from 'threads/worker';
import { Task } from '../../models/database';
import tasksService from '../../services/tasks.service';

const taskWorker = (task: Task) => tasksService.complete(task);

export type TaskWorker = typeof taskWorker;

expose(taskWorker);
