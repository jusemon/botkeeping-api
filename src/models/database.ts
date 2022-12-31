export type Task = {
  id: number;
  description: string;
  duration: number;
  isActive: boolean;
  queryable?: string;
};

export type Bot = {
  id: number;
  name: string;
  createdAt?: Date;
  queryable?: string;

  tasks?: ReadonlyArray<Task>;
};

export interface TaskBot {
  taskId: number;
  botId: number;
  createdAt: Date;
  completedAt: Date;
}
