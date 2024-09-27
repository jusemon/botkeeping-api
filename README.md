# Botkeeping API

## Requirements

- Last stable version of redis
- Last stable version of MySQL/MariaDB
- A PC

## Installation

For run locally it needs a `.env` file with the environment variables defined in
the `.env.example`

The database scripts are under the scripts folder, please run them in order.

### Development

ALLOWED_ORIGINS includes a comma-separated list of the allowed CORS sites.

Install dependencies `npm install` or `yarn` To start the project run
`npm run dev` or `yarn dev`

### Production

For run it in docker just run `docker compose up`

Alternatively, you can run the image without cloning this repo using the image
published
[here](https://git.jusemon.com/jusemon/-/packages/container/botkeeping-api/1.0.0)

With docker run (replace ${ENV_VARIABLE} with your values):

```sh
docker run -p ${PORT}:${PORT} -e NODE_ENV=${NODE_ENV} -e HOST=${HOST} -e PORT=${PORT} -e API_VERSION=${API_VERSION} -e ALLOWED_ORIGINS=${ALLOWED_ORIGINS} -e DB_HOST=${DB_HOST} -e DB_DATABASE=${DB_DATABASE} -e DB_USER=${DB_USER} -e DB_PASSWORD=${DB_PASSWORD} -e DB_PORT=${DB_PORT} -e REDIS_HOST=${REDIS_HOST} -e REDIS_PORT=${REDIS_PORT} git.jusemon.com/jusemon/botkeeping-api:1.0.0
```

With docker compose (the ${ENV_VARIABLE} will be taken from the .env
automatically):

```yaml
name: botkeeping
services:
  api:
    image: git.jusemon.com/jusemon/botkeeping-api:1.0.0
    ports:
      - ${PORT}:${PORT}
    environment:
      NODE_ENV: ${NODE_ENV}
      HOST: ${HOST}
      PORT: ${PORT}
      API_VERSION: ${API_VERSION}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
      DB_HOST: ${DB_HOST}
      DB_DATABASE: ${DB_DATABASE}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_PORT: ${DB_PORT}
      REDIS_HOST: ${REDIS_HOST}
      REDIS_PORT: ${REDIS_PORT}
```

## Libraries Used

- bullmq (for asynchronous work)
- threads (for asynchronous work)
- koa (for api rest)
- mysql2 (for database operations)

## Credits

- Created by Juan Sebastián Montoya

## License

This project is licensed under the
[MIT License](https://opensource.org/licenses/MIT).
