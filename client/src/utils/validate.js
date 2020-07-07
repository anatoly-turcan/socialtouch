import validate from 'validate.js';

export default (data, constraints) => {
  const errors = validate(data, constraints, {
    format: 'flat',
    fullMessages: false,
  });

  return errors ? errors[0] : null;
};
