import React from 'react';
import AuthPage from './authPage';
import Form from './form';
import Input from './input';

const Forgot = (props) => {
  return (
    <AuthPage>
      <Form
        title="Forgot password"
        btn="Reset"
        reverse="Sign in"
        reverseLink="/signin"
      >
        <Input name="email" type="email" placeholder="Email" />
      </Form>
    </AuthPage>
  );
};

export default Forgot;
