import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { FilterRequestParams, Repository, Response } from '../models/common';
import { Bot, Task } from '../models/database';

import { getConnection } from './db';

type BotsRepository = Repository<Bot>;

const create = async (bot: Bot) => {
  const insertBotSql = 'INSERT INTO bots (name) VALUES (?)';
  const selectTasksSql =
    'SELECT * FROM tasks WHERE id NOT IN (SELECT taskId FROM tasks_bot) LIMIT 2;';
  const insertTasksBotSql = 'INSERT INTO tasks_bot (botId, taskId) VALUES ';
  const conn = await getConnection();
  try {
    conn.beginTransaction();
    const [insertBotResponse] = await conn.query<ResultSetHeader>(
      insertBotSql,
      [bot.name],
    );

    if (!insertBotResponse.affectedRows) {
      throw new Error('Bot not inserted');
    }
    const [tasksResponse] = await conn.query<Array<RowDataPacket>>(
      selectTasksSql,
    );

    if (tasksResponse.length == 0) {
      throw new Error('No tasks available');
    }

    const insertedBot = { ...bot, id: insertBotResponse.insertId } as Bot;
    const insertsSql = tasksResponse.map(() => '(?, ?)').join(', ');

    await conn.query<ResultSetHeader>(
      insertTasksBotSql + insertsSql,
      tasksResponse.flatMap((t) => [insertedBot.id, t.id]),
    );

    insertedBot.tasks = tasksResponse.map<Task>((result: any) => {
      const { queryable: _, ...task } = result;
      return task;
    });

    await conn.commit();
    return insertedBot;
  } catch (error) {
    await conn.rollback();
    throw error;
  }
};

const update = async (bot: Bot) => {
  const sql = 'UPDATE bots SET name = ? WHERE id = ?';
  const conn = await getConnection();
  const [response] = await conn.query<ResultSetHeader>(sql, [bot.name, bot.id]);
  if (response.affectedRows) {
    return { ...bot };
  }
  return null;
};

const read = async (id: number) => {
  const sql = `
    SELECT B.*, T.id as taskId, T.description, T.duration, T.isActive
    FROM bots B
    INNER JOIN tasks_bot TB on B.id = TB.botId
    INNER JOIN tasks T on TB.taskId = T.id
    WHERE B.id = ?
  `;
  const conn = await getConnection();
  const [results] = await conn.query<Array<RowDataPacket>>(sql, [id]);
  const data = results.reduce<Bot>(
    (
      bot,
      { id, name, createdAt, description, duration, isActive, taskId },
    ) => ({
      id,
      name,
      createdAt,
      tasks: [
        ...(bot?.tasks || []),
        { id: taskId, description, duration, isActive },
      ],
    }),
    {} as Bot,
  );

  return data;
};

const readAll = async ({ filter, page, pageSize }: FilterRequestParams) => {
  const hasPagination = Number.isInteger(pageSize) && Number.isInteger(page);
  const countSelect = 'SELECT COUNT(*) as totalElements FROM bots';
  const select = `
    SELECT B.*, T.id as taskId, T.description, T.duration, T.isActive
    FROM bots B
    INNER JOIN tasks_bot TB on B.id = TB.botId
    INNER JOIN tasks T on TB.taskId = T.id
    WHERE B.id IN
  `;
  const subquery = 'SELECT id FROM bots ';
  const where = filter ? ' WHERE B.queryable like ?' : '';
  const pagination = hasPagination ? ' LIMIT ? OFFSET ?' : '';

  const conn = await getConnection();

  const [[{ totalElements }]] = await conn.query<Array<RowDataPacket>>(
    countSelect + where,
    [...(filter ? [`%${filter}%`] : [])],
  );
  const [results] = await conn.query<Array<RowDataPacket>>(
    `${select} (${subquery}${where}${pagination})`,
    [
      ...(filter ? [`%${filter}%`] : []),
      ...(hasPagination ? [pageSize!, page! * pageSize!] : []),
    ],
  );

  const data = Object.values(
    results.reduce<Record<number, Bot>>(
      (
        bots,
        { id, name, createdAt, description, duration, isActive, taskId },
      ) => ({
        ...bots,
        [id]: {
          ...(bots[id] || { id, name, createdAt }),
          tasks: [
            ...(bots[id]?.tasks || []),
            { id: taskId, description, duration, isActive },
          ],
        },
      }),
      {},
    ),
  );

  return {
    data,
    page: page || 0,
    totalElements,
    pageSize: data.length,
  } as Response<Bot>;
};

const remove = async (id: number) => {
  const sql = 'DELETE FROM bots WHERE id = ?';
  const conn = await getConnection();

  await conn.query(sql, [id]);
};

export default {
  create,
  read,
  readAll,
  update,
  remove,
} as BotsRepository;
