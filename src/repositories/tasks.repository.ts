import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { FilterRequestParams, Repository, Response } from '../models/common';
import { Task } from '../models/database';

import { getConnection } from './db';

type TasksRepository = Repository<Task>;

const create = async (task: Task) => {
  const sql = 'INSERT INTO tasks (description, duration) VALUES (?)';
  const conn = await getConnection();
  const [response] = await conn.query<ResultSetHeader>(sql, [task.description, task.duration]);
  if (response.affectedRows) {
    return { ...task, id: response.insertId };
  }
  return null;
};

const update = async (task: Task) => {
  const sql = 'UPDATE tasks SET description = ?, duration = ? WHERE id = ?';
  const conn = await getConnection();
  const [response] = await conn.query<ResultSetHeader>(sql, [
    task.description,
    task.duration,
    task.id,
  ]);
  if (response.affectedRows) {
    return { ...task };
  }
  return null;
};

const read = async (id: number) => {
  const sql = 'SELECT * FROM tasks WHERE id = ?';
  const conn = await getConnection();
  const [response] = await conn.query<Array<RowDataPacket>>(sql, [id]);
  const [{ queryable: _, ...result }] = response;
  return result;
};

const readAll = async({ filter, page, pageSize }: FilterRequestParams) => {
  const hasPagination = Number.isInteger(pageSize) && Number.isInteger(page);
  const countSelect = 'SELECT COUNT(*) as totalElements FROM tasks';
  const select = 'SELECT * FROM tasks';
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
  const data = results.map<Task>((result: any) => {
    const { queryable: _, ...task } = result;
    return task;
  });

  return {
    data,
    page: page || 0,
    totalElements,
    pageSize: data.length,
  } as Response<Task>;
};

const remove = async (id: number) => {
  const sql = 'DELETE FROM tasks WHERE id = ?';
  const conn = await getConnection();

  await conn.query(sql, [id]);
};

export default {
  create,
  read,
  readAll,
  update,
  remove,
} as TasksRepository;
