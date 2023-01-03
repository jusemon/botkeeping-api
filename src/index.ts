import { initializeConsumers } from './queues';
import { initializeServer } from './server';


// Consumers
initializeConsumers();

// Server
initializeServer();