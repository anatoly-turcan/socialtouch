/* eslint-disable global-require */
require('dotenv').config({ path: './config/.env' });
const { createConnection } = require('typeorm');
const http = require('http');
const socketio = require('socket.io');
const appInit = require('./app');
const socketController = require('./controllers/socketController');

createConnection()
  .then(async (connection) => {
    console.log('> TypeORM connected');

    const app = appInit(connection);
    const server = http.createServer(app);
    const io = socketio(server);

    io.on('connection', (socket) => socketController(socket, connection, io));

    const port = process.env.PORT || 3000;

    server.listen(port, async () => {
      console.log(`> socialTouch/api running on port ${port}`);
    });
  })
  .catch((error) => console.log('ERROR:', error));
