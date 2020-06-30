/* eslint-disable no-console */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT+0',
    },
    pool: {
      min: 0,
      max: 5,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
    // logging: (...msg) => console.log(`> SQL: ${msg}`),
  }
);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('> MariaDB connected');
  })
  .catch((error) => {
    console.log('> MariaDB connection ERROR:', error);
  });

module.exports = sequelize;
