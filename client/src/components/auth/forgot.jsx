import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../../context/userContext';
import AuthPage from '../../pages/auth';
import Form from './form';
import Input from '../common/input';
import { forgotPassword } from '../../services/apiService';

const Forgot = () => {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState('');

  if (user) return <Redirect to="/" />;

  const handleSubmit = async (data) => {
    setMessage(await forgotPassword(data));
  };

  return (
    <AuthPage>
      {message ? (
        <p className="block__result-message">{message}</p>
      ) : (
        <Form
          title="Forgot password"
          btn="Reset"
          reverse={{ title: 'Sign in', link: '/signin' }}
          init={{ email: '' }}
          handleSubmit={handleSubmit}
        >
          {(handleChange, data) => (
            <Input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              value={data.email}
            />
          )}
        </Form>
      )}
    </AuthPage>
  );
};

export default Forgot;
