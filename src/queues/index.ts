import { initializeTaskConsumer } from './consumers/tasks.consumer';

export const initializeConsumers = () => {
  // Add all the consumers here.
  initializeTaskConsumer();
};
