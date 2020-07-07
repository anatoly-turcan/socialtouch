import React from 'react';

const Input = ({ name, ...rest }) => {
  return <input {...rest} name={name} required />;
};

export default Input;
