import React, { useState, useContext } from 'react';
import AuthPage from '../../pages/auth';
import Form from './form';
import Input from './input';
import api from '../../services/apiService';
import UserContext from './../../context/userContext';
import { Redirect } from 'react-router-dom';

const Forgot = (props) => {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState('');

  if (user) return <Redirect to="/" />;

  const handleSubmit = async (data) => {
    setMessage(await api.forgotPassword(data));
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
