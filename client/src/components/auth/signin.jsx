import React, { useState, useContext } from 'react';
import Form from './form';
import AuthPage from '../../pages/auth';
import Input from './input';
import auth from '../../services/authService';
import UserContext from '../../context/userContext';
import constraints from './constraints';
import validate from '../../utils/validate';

const Signin = ({ history }) => {
  const { setUser } = useContext(UserContext);
  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validate(data, constraints);
    if (validation) return setError(validation);

    try {
      const result = await auth.signin(data);
      const { user } = result.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      history.replace(`/${user.link}`);
    } catch ({ response }) {
      setError(response.data.message);
    }
  };

  return (
    <AuthPage>
      <Form
        title="Sign in"
        reverse="Sign up"
        reverseLink="/signup"
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
        <Input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={data.password}
        />
      </Form>
    </AuthPage>
  );
};

export default Signin;
