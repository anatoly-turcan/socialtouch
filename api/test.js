const validate = require('validate.js');

validate.validators.comparePasswords = (value, options) => {
  return options;
};

const constraints = {
  test: {
    comparePasswords: 'Message',
  },
};

console.log(validate({ test: { a: 'a', b: 'b' } }, constraints));
