import React, { Fragment } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import Form from './form';
import Input from '../common/input';
import AuthPage from '../../pages/auth';
import { resetPassword } from '../../services/apiService';

const Restore = () => {
  const { token } = useParams();

  if (!token) return <Redirect to="/" />;

  const handleSubmit = async (data) => {
    try {
      const success = await resetPassword(token, data);
      if (success) window.location = '/';
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    }
  };

  return (
    <AuthPage>
      <Form
        title="Restore password"
        btn="Confirm"
        init={{ password: '', passwordConfirm: '' }}
        handleSubmit={handleSubmit}
      >
        {(handleChange, data) => (
          <Fragment>
            <Input
              name="password"
              type="password"
              placeholder="New password"
              onChange={handleChange}
              value={data.password}
            />
            <Input
              name="passwordConfirm"
              type="password"
              placeholder="Confirm new password"
              onChange={handleChange}
              value={data.passwordConfirm}
            />
          </Fragment>
        )}
      </Form>
    </AuthPage>
  );
};

export default Restore;
