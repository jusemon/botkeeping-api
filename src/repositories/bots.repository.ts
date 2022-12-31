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

    if (insertBotResponse.affectedRows) {
      const newBot = { ...bot, id: insertBotResponse.insertId } as Bot;
      const [tasksResponse] = await conn.query<Array<RowDataPacket>>(
        selectTasksSql,
      );

      if (tasksResponse.length > 0) {
        const insertsSql = tasksResponse.map(() => '(?, ?)').join(', ');
        const [insertTasksForBotResponse] = await conn.query<ResultSetHeader>(
          insertTasksBotSql + insertsSql,
          tasksResponse.flatMap((t) => [newBot.id, t.id]),
        );

        conn.commit();

        if (insertTasksForBotResponse.affectedRows == tasksResponse.length) {
          return {
            ...newBot,
            tasks: tasksResponse.map<Task>((result: any) => {
              const { queryable: _, ...task } = result;
              return task;
            }),
          };
        }
      }

      conn.commit();
      return newBot;
    } else {
      throw new Error('Bot not inserted');
    }
  } catch (error) {
    conn.rollback();
  }
  return null;
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
  const sql = 'SELECT * FROM bots WHERE id = ?';
  const conn = await getConnection();
  const [response] = await conn.query<Array<RowDataPacket>>(sql, [id]);
  const [{ queryable: _, ...result }] = response;
  return result;
};

const readAll = async ({ filter, page, pageSize }: FilterRequestParams) => {
  const hasPagination = Number.isInteger(pageSize) && Number.isInteger(page);
  const countSelect = 'SELECT COUNT(*) as totalElements FROM bots';
  const select = 'SELECT * FROM bots';
  const where = filter ? ' WHERE queryable like ?' : '';
  const pagination = hasPagination ? ' LIMIT ? OFFSET ?' : '';

  const conn = await getConnection();

  const [[{ totalElements }]] = await conn.query<Array<RowDataPacket>>(
    countSelect + where,
    [
      ...(filter ? [`%${filter}%`] : []),
    ],
  );
  const [results] = await conn.query<Array<RowDataPacket>>(
    select + where + pagination,
    [
      ...(filter ? [`%${filter}%`] : []),
      ...(hasPagination ? [pageSize!, page! * pageSize!] : []),
    ],
  );
  const data = results.map<Bot>((result: any) => {
    const { queryable: _, ...bot } = result;
    return bot;
  });

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
