import React from 'react';

const Input = ({ name, ...rest }) => {
  return <input {...rest} name={name} id={name} />;
};

export default Input;
