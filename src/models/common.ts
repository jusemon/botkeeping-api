export type Response<T> = {
  data: ReadonlyArray<T>;
  page: number;
  pageSize: number;
  totalElements: number;
};

export type FilterRequestParams = {
  page?: number;
  pageSize?: number;
  filter?: string | number | Date;
};

export type Repository<T> = {
  create: (entity: T) => Promise<T>;
  update: (entity: T) => Promise<T>;
  read: (id: number) => Promise<T>;
  readAll: (filter?: FilterRequestParams) => Promise<Response<T>>;
  remove: (id: number) => Promise<void>;
};

export type Service<TRequest, TResponse> = {
  create: (dto: TRequest) => Promise<TResponse>;
  update: (id: number, dto: TRequest) => Promise<TResponse>;
  read: (id: number) => Promise<TResponse>;
  readAll: (filter?: FilterRequestParams) => Promise<Response<TResponse>>;
  remove: (id: number) => Promise<void>;
};
