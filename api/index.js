/* eslint-disable no-console */
require('dotenv').config({ path: './config/.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`socialTouch/api running on port ${port}`);
});
