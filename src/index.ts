import { initializeTaskConsumer } from './consumers/tasks.consumer';
import { initializeServer } from './server';


// Consumers
initializeTaskConsumer();

// Server
initializeServer();