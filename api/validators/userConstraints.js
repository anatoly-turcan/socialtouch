const username = {
  length: {
    minimum: 2,
    maximum: 30,
    tooShort: 'Username is too short (at least 2 characters)',
    tooLong: 'Username is too long (no more than 30 characters)',
  },
};

const email = {
  email: { message: 'Invalid email address' },
};

const password = {
  length: {
    minimum: 8,
    maximum: 30,
    tooShort: 'Password is too short (at least 8 characters)',
    tooLong: 'Password is too long (no more than 30 characters)',
  },
};

const passwordConfirm = {
  presence: { message: 'You must confirm your password' },
  equality: {
    attribute: 'password',
    message: 'Password mismatch',
  },
};

const link = {
  length: {
    minimum: 4,
    maximum: 24,
    tooShort: 'Link is too short (at least 4 characters)',
    tooLong: 'Link is too long (no more than 24 characters)',
  },
  format: {
    pattern: '[a-z0-9_-]+',
    flags: 'i',
    message: 'Short link can only contain a-z, 0-9, _, and -',
  },
};

exports.create = {
  username: { presence: true, ...username },
  email: { presence: true, ...email },
  password: { presence: true, ...password },
  passwordConfirm: { presence: true, ...passwordConfirm },
};

exports.newPassword = {
  password: { presence: true, ...password },
  passwordConfirm: { presence: true, ...passwordConfirm },
};

exports.email = { email: { presence: true, ...email } };

exports.emailAndPassword = {
  email: { presence: true, ...email },
  password: { presence: true, ...password },
};

exports.updateMe = { username, email, link };
