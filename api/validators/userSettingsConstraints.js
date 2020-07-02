module.exports = {
  age: {
    type: 'number',
  },
  gender: {
    format: {
      pattern: '^(male|female)$',
      flags: 'i',
      message: 'Gender must be male or female',
    },
  },
};
