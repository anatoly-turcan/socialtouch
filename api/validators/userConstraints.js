const constraints = {
  username: {
    presence: true,
    length: {
      minimum: 2,
      maximum: 30,
      tooShort: 'Username is too short (at least 2 characters)',
      tooLong: 'Username is too long (no more than 30 characters)',
    },
  },
  email: {
    email: { message: 'Invalid email address' },
  },
  password: {
    presence: true,
    length: {
      minimum: 8,
      maximum: 30,
      tooShort: 'Password is too short (at least 8 characters)',
      tooLong: 'Password is too long (no more than 30 characters)',
    },
  },
  passwordConfirm: {
    presence: { message: 'You must confirm your password' },
    equality: {
      attribute: 'password',
      message: 'Password mismatch',
    },
  },
};

const { email, password, passwordConfirm } = constraints;

exports.create = { ...constraints };
exports.newPassword = { password, passwordConfirm };
exports.email = { email };
exports.emailAndPassword = { email, password };
