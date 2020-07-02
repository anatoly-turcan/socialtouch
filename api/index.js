/* eslint-disable global-require */
require('dotenv').config({ path: './config/.env' });
const { createConnection } = require('typeorm');
const appInit = require('./app');

createConnection()
  .then(async (connection) => {
    console.log('> TypeORM connected');

    const app = appInit(connection);

    const port = process.env.PORT || 3000;

    app.listen(port, async () => {
      console.log(`> socialTouch/api running on port ${port}`);
    });
  })
  .catch((error) => console.log('ERROR:', error));
