import React from 'react';

const Input = ({ name, type, reference, ...rest }) => {
  return (
    <input
      {...rest}
      type={type || 'text'}
      name={name}
      id={name}
      ref={reference}
    />
  );
};

export default Input;
