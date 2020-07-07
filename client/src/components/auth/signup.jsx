import React from 'react';
import Form from './form';
import AuthPage from './authPage';
import Input from './input';

const Signup = (props) => {
  return (
    <AuthPage>
      <Form title="Sign up" reverse="Sign in" reverseLink="/signin">
        <Input name="username" type="text" placeholder="Username" />
        <Input name="email" type="email" placeholder="Email" />
        <Input name="password" type="password" placeholder="Password" />
        <Input
          name="passwordConfirm"
          type="password"
          placeholder="Confirm password"
        />
      </Form>
    </AuthPage>
  );
};

export default Signup;
