const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { joinChat, createMessage } = require('./chatController');
const User = require('../entities/userSchema');

const auth = async (socket, connection) => {
  try {
    const { jwt: token } = cookie.parse(socket.client.request.headers.cookie);

    if (!token) throw new Error();

    const { id } = jwt.decode(token);
    const additionalColumns = [
      'user.email',
      'user.salt',
      'user.passwordHash',
      'user.passwordResetToken',
      'user.passwordChangedAt',
      'user.active',
      'user.createdAt',
      'user.updatedAt',
      'img.location',
    ];

    const user = await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.image', 'img')
      .select()
      .addSelect(...additionalColumns)
      .where('user.active = 1 AND user.id = :id', { id })
      .getOne();

    if (!user) throw new Error();

    await promisify(jwt.verify)(token, process.env.JWT_SECRET + user.salt);

    return user;
  } catch (error) {
    socket.emit('error', 'Something went wrong');
  }
};

module.exports = (socket, connection, io) => {
  let user;

  socket.on('chat', async (targetLink) => {
    user = await auth(socket, connection);
    const room = await joinChat({
      socket,
      user,
      targetLink,
      connection,
    });

    socket.emit('room', room);
  });

  socket.on('send', async ({ message, room }) => {
    const response = await createMessage({ connection, user, message, room });
    io.in(room).emit('message', response);
  });
};
