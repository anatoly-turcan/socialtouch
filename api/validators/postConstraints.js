module.exports = {
  content: {
    presence: { message: 'Please indicate the post message' },
    length: {
      minimum: 1,
      tooShort: 'Please indicate the post message',
    },
  },
};
