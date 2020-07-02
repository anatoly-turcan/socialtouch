const validate = require('validate.js');

module.exports = (model, constraints) => {
  const errors = validate(model, constraints, {
    format: 'flat',
    fullMessages: false,
  });

  return errors ? errors[0] : null;
};
