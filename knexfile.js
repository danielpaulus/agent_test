// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
  client: 'postgresql',
  connection: process.env.POSTGRES_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
module.exports = {
  production: config,
  development: config,
};
