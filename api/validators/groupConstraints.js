const name = {
  length: {
    minimum: 2,
    maximum: 30,
    tooShort: 'Group name is too short (at least 2 characters)',
    tooLong: 'Group name is too long (no more than 30 characters)',
  },
};

const description = {
  length: {
    minimum: 1,
    tooShort: 'Please indicate the group description',
  },
};

exports.create = {
  name: { presence: { message: 'Please indicate the group name' }, ...name },
  description,
};

exports.update = { name, description };
