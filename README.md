# Requirements

- Last stable version of redis
- Last stable version of MySQL
- A PC

# Installation

For run locally it needs a .env file with the environment variables defined in the .env.example

ALLOWED_ORIGINS includes a comma separated list for the allowed CORS sites.

To change the database config like server, database and user, the file src/config.js needs to be updated.

Install dependencies npm install or yarn
To start the project run `npm run serve` or `yarn serve`

The database scripts are under the scripts folder, please run them in order.
