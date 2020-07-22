/* eslint-disable no-console */
/* eslint-disable global-require */
require('dotenv').config({ path: './.env' });
const { createConnection } = require('typeorm');
const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const socketController = require('./controllers/socketController');

createConnection()
  .then(() => console.log('> Database connected'))
  .catch((error) => console.log('ERROR:', error));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => socketController(socket, io));

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`> socialTouch/api running on port ${port}`);
});
