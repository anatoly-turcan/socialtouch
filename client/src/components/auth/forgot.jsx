import React, { useState } from 'react';
import AuthPage from '../../pages/auth';
import Form from './form';
import Input from './input';
import auth from '../../services/authService';
import constraints from './constraints';
import validate from '../../utils/validate';

const Forgot = (props) => {
  const [data, setData] = useState({ email: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validate(data, constraints);
    if (validation) return setError(validation);

    try {
      const result = await auth.forgotPassword(data);
      setMessage(result.data.message);
    } catch ({ response }) {
      setError(response.data.message);
    }
  };

  return (
    <AuthPage>
      {message ? (
        <p className="block__result-message">{message}</p>
      ) : (
        <Form
          title="Forgot password"
          btn="Reset"
          reverse="Sign in"
          reverseLink="/signin"
          onSubmit={handleSubmit}
          error={error}
        >
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
          />
        </Form>
      )}
    </AuthPage>
  );
};

export default Forgot;
