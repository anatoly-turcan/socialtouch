module.exports = {
  content: {
    presence: { message: 'Please indicate the comment message' },
    length: {
      minimum: 1,
      tooShort: 'Please indicate the comment message',
    },
  },
};
