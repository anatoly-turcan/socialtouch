import React from 'react';

const Input = ({ name, type, ...rest }) => {
  return <input {...rest} type={type || 'text'} name={name} id={name} />;
};

export default Input;
