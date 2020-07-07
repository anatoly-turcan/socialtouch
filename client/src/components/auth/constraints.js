export default {
  username: {
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
    length: {
      minimum: 8,
      maximum: 30,
      tooShort: 'Password is too short (at least 8 characters)',
      tooLong: 'Password is too long (no more than 30 characters)',
    },
  },
  passwordConfirm: {
    equality: {
      attribute: 'password',
      message: 'Password mismatch',
    },
  },
};
