/* eslint-disable global-require */
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

module.exports = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.DB_NAME_TEST
      : process.env.DB_NAME,
  charset: 'utf8mb4_unicode_ci',
  entities: ['entities/*.js'],
  namingStrategy: new SnakeNamingStrategy(),
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};
