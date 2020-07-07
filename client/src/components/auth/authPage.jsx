import React from 'react';

const AuthPage = (props) => {
  return (
    <div className="content__login">
      <div className="login-el logo">
        <span className="social">social</span>
        <span className="touch">Touch</span>
      </div>
      <div className="block">{props.children}</div>
    </div>
  );
};

export default AuthPage;
