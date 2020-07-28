const User = require('../entities/userSchema');
const Chat = require('../entities/chatSchema');
const Message = require('../entities/messageSchema');
const ChatModel = require('../models/chatModel');
const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');

exports.joinChat = async ({ socket, user, targetLink, connection }) => {
  try {
    const target = await connection
      .getRepository(User)
      .findOne({ where: { link: targetLink }, relations: ['image'] });

    let chatRoom;
    chatRoom = await connection.getRepository(Chat).findOne({
      userId: Math.min(user.id, target.id),
      targetId: Math.max(user.id, target.id),
    });

    if (!chatRoom) {
      const chat = new ChatModel(
        Math.min(user.id, target.id),
        Math.max(user.id, target.id)
      ).prepare();

      await connection
        .getRepository(Chat)
        .createQueryBuilder()
        .insert()
        .values(chat)
        .execute();

      chatRoom = chat;
    }

    socket.join(chatRoom.link);

    return chatRoom.link;
  } catch (error) {
    socket.emit('error', 'Something went wrong');
  }
};

exports.getChats = catchError(async ({ connection, user }, res, next) => {
  const result = await connection
    .getRepository(Chat)
    .createQueryBuilder('chat')
    .leftJoinAndSelect(User, 'u', 'chat.userId = u.id OR chat.targetId = u.id')
    .leftJoinAndSelect('u.image', 'img')
    .where(`u.id != :id AND (chat.userId = :id OR chat.targetId = :id)`, {
      id: user.id,
    })
    .select(['chat.link', 'u.username', 'u.link', 'img.location'])
    .getRawMany();

  const chats = result.map((el) => {
    return Object.keys(el).reduce((acc, key) => {
      return { ...acc, [key.replace('u_', '')]: el[key] };
    }, {});
  });

  res.status(200).json({
    status: 'success',
    data: {
      chats,
    },
  });
});

exports.createMessage = async ({ connection, user, message, room }) => {
  try {
    const createdAt = new Date().toISOString();

    await connection
      .getRepository(Message)
      .createQueryBuilder('message')
      .insert()
      .values({
        room,
        userId: user.id,
        content: message,
        createdAt,
      })
      .execute();

    return {
      content: message,
      author: {
        username: user.username,
        link: user.link,
        image: user.image ? user.image.location : null,
      },
      at: createdAt,
    };
  } catch (error) {
    console.log(error);
  }
};

exports.getMessages = catchError(
  async ({ connection, user, params, query }, res, next) => {
    const { offset, limit } = query;

    const chat = await connection
      .getRepository(Chat)
      .findOne({ where: { link: params.room } });

    if (chat.userId !== user.id && chat.targetId !== user.id)
      return next(new AppError('Chat not found', 400));

    const messages = await connection
      .getRepository(Message)
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .leftJoinAndSelect('user.image', 'image')
      .where('message.room = :room', {
        id: user.id,
        room: params.room,
      })
      .select([
        'message.id',
        'message.content',
        'message.createdAt',
        'user.link',
        'user.username',
        'image.location',
      ])
      .skip(offset || 0)
      .take(limit || 20)
      .getMany();

    messages.forEach((message) => {
      message.at = message.createdAt;
      message.author = message.user;
      message.author.image = message.user.image
        ? message.user.image.location
        : null;
      delete message.id;
      delete message.createdAt;
      delete message.user;
    });

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: {
        messages,
      },
    });
  }
);
