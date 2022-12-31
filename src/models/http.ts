import { Response } from "./common";

// Task

export type TaskResponse = {
  id: number;
  description: string;
  duration: number;
  isActive: boolean;
};

export type GetTaskResponseBody = TaskResponse | Response<TaskResponse>;

export type PostTaskRequestBody = {
  description: string;
  duration: number;
  isActive: boolean;
};

// Bot

export type TaskBotResponse = {
  id: number;
  description: string;
  duration: number;
  completedAt?: Date;
};

export type BotResponse = {
  id: number;
  name: string;
  createdAt: Date;
  tasks: ReadonlyArray<TaskBotResponse>;
};

export type GetBotResponseBody = BotResponse | Response<BotResponse>;

export type PostBotRequestBody = {
  name: string;
};