import React from 'react';
import Form from './form';
import Input from './input';
import AuthPage from '../../pages/auth';

const Restore = (props) => {
  return (
    <AuthPage>
      <Form title="Restore password" btn="Confirm">
        <Input name="password" type="password" placeholder="New password" />
        <Input
          name="passwordConfirm"
          type="password"
          placeholder="Confirm new password"
        />
      </Form>
    </AuthPage>
  );
};

export default Restore;
